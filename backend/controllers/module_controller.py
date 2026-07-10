from flask import Blueprint, g, request

from database.connection import db_cursor
from middleware.auth import hash_password, require_auth
from middleware.errors import ApiError
from models.module_registry import MODULES, NAVIGATION

module_bp = Blueprint("modules", __name__, url_prefix="/api")

ALLOWED_DIRECTIONS = {"asc", "desc"}


def _module_or_404(module_key):
    module = MODULES.get(module_key)
    if not module:
        raise ApiError("Unknown module.", 404)
    return module


def _require_module_permission(module):
    permission = module["permission"]
    if permission not in g.permissions and "system.manage" not in g.permissions:
        raise ApiError("You do not have permission to access this module.", 403)


def _field_names(module):
    return [field for field, definition in module["fields"].items() if not definition.get("virtual")]


def _validate_payload(module, data, partial=False):
    cleaned = {}
    errors = {}
    for field, definition in module["fields"].items():
        if field not in data:
            if definition.get("required") and not partial:
                errors[field] = "This field is required."
            continue
        value = data.get(field)
        if value == "":
            value = None
        if definition.get("required") and value is None:
            errors[field] = "This field is required."
            continue
        if value is not None and definition.get("type") == "number":
            try:
                value = float(value) if "." in str(value) else int(value)
            except ValueError:
                errors[field] = "A numeric value is required."
                continue
        if value is not None and definition.get("options") and value not in definition["options"]:
            errors[field] = "Invalid option."
            continue
        cleaned[field] = value
    if errors:
        raise ApiError("Validation failed.", 422, errors)
    return cleaned


def _serialize_meta(module_key, module):
    return {
        "key": module_key,
        "title": module["title"],
        "fields": module["fields"],
        "list": module["list"],
        "permission": module["permission"],
    }


@module_bp.get("/modules")
@require_auth()
def modules():
    allowed = []
    for key, label, permission in NAVIGATION:
        if permission in g.permissions or "system.manage" in g.permissions:
            allowed.append({"key": key, "label": label, "permission": permission})
    return {"modules": allowed}


@module_bp.get("/public/settings")
def public_settings():
    public_keys = (
        "school_name",
        "school_logo",
        "favicon",
        "brand_color",
        "portal_accent",
        "login_background",
    )
    placeholders = ", ".join(["%s"] * len(public_keys))
    with db_cursor() as cursor:
        cursor.execute(
            f"SELECT setting_key, setting_value FROM school_settings WHERE setting_key IN ({placeholders})",
            public_keys,
        )
        records = cursor.fetchall()
    return {"settings": {row["setting_key"]: row["setting_value"] for row in records}}


@module_bp.get("/modules/<module_key>/meta")
@require_auth()
def module_meta(module_key):
    module = _module_or_404(module_key)
    _require_module_permission(module)
    return {"module": _serialize_meta(module_key, module)}


@module_bp.get("/modules/<module_key>")
@require_auth()
def list_records(module_key):
    module = _module_or_404(module_key)
    _require_module_permission(module)

    page = max(int(request.args.get("page", 1)), 1)
    per_page = min(max(int(request.args.get("per_page", 10)), 1), 100)
    offset = (page - 1) * per_page
    search = (request.args.get("search") or "").strip()
    sort = request.args.get("sort") or "id"
    direction = (request.args.get("direction") or "desc").lower()

    table = module["table"]
    valid_sort = {"id", "created_at", "updated_at", *_field_names(module), *module.get("list", [])}
    if sort not in valid_sort:
        sort = "id"
    if direction not in ALLOWED_DIRECTIONS:
        direction = "desc"
    sort_expression = f"{table}.{sort}" if sort in {"id", "created_at", "updated_at", *_field_names(module)} else sort

    where = ["1=1"]
    params = []
    if search and module.get("search"):
        searchable = []
        for field in module["search"]:
            searchable.append(f"{table}.{field} LIKE %s")
            params.append(f"%{search}%")
        where.append("(" + " OR ".join(searchable) + ")")

    filters = request.args.get("filters")
    if filters:
        for pair in filters.split(","):
            if ":" not in pair:
                continue
            field, value = pair.split(":", 1)
            if field in _field_names(module):
                where.append(f"{table}.{field} = %s")
                params.append(value)

    columns = [f"{table}.id", f"{table}.created_at", f"{table}.updated_at"]
    columns.extend([f"{table}.{field}" for field in _field_names(module)])
    columns.extend(module.get("select_extra", []))
    joins = module.get("joins", "")
    where_sql = " AND ".join(where)

    with db_cursor() as cursor:
        count_sql = f"SELECT COUNT(*) AS total FROM {table} {joins} WHERE {where_sql}"
        cursor.execute(count_sql, params)
        total = cursor.fetchone()["total"]

        data_sql = f"""
            SELECT {", ".join(columns)}
            FROM {table}
            {joins}
            WHERE {where_sql}
            ORDER BY {sort_expression} {direction}
            LIMIT %s OFFSET %s
        """
        cursor.execute(data_sql, [*params, per_page, offset])
        records = cursor.fetchall()

    return {
        "records": records,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page,
        },
    }


@module_bp.post("/modules/<module_key>")
@require_auth()
def create_record(module_key):
    module = _module_or_404(module_key)
    _require_module_permission(module)
    data = _validate_payload(module, request.get_json(silent=True) or {})
    if module_key == "user-management":
        data["password_hash"] = hash_password(data.pop("password"))
    fields = list(data.keys())
    placeholders = ", ".join(["%s"] * len(fields))
    sql = f"INSERT INTO {module['table']} ({', '.join(fields)}) VALUES ({placeholders})"
    with db_cursor(commit=True) as cursor:
        cursor.execute(sql, [data[field] for field in fields])
        record_id = cursor.lastrowid
    return {"id": record_id, "message": "Record created."}, 201


@module_bp.get("/modules/<module_key>/<int:record_id>")
@require_auth()
def get_record(module_key, record_id):
    module = _module_or_404(module_key)
    _require_module_permission(module)
    table = module["table"]
    with db_cursor() as cursor:
        cursor.execute(f"SELECT * FROM {table} WHERE id = %s", (record_id,))
        record = cursor.fetchone()
    if not record:
        raise ApiError("Record not found.", 404)
    return {"record": record}


@module_bp.put("/modules/<module_key>/<int:record_id>")
@require_auth()
def update_record(module_key, record_id):
    module = _module_or_404(module_key)
    _require_module_permission(module)
    data = _validate_payload(module, request.get_json(silent=True) or {}, partial=True)
    if module_key == "user-management" and "password" in data:
        data["password_hash"] = hash_password(data.pop("password"))
    if not data:
        raise ApiError("No valid fields were supplied.", 422)
    assignments = ", ".join([f"{field} = %s" for field in data])
    sql = f"UPDATE {module['table']} SET {assignments} WHERE id = %s"
    with db_cursor(commit=True) as cursor:
        cursor.execute(sql, [*data.values(), record_id])
        if cursor.rowcount == 0:
            raise ApiError("Record not found.", 404)
    return {"message": "Record updated."}


@module_bp.delete("/modules/<module_key>/<int:record_id>")
@require_auth()
def delete_record(module_key, record_id):
    module = _module_or_404(module_key)
    _require_module_permission(module)
    with db_cursor(commit=True) as cursor:
        cursor.execute(f"DELETE FROM {module['table']} WHERE id = %s", (record_id,))
        if cursor.rowcount == 0:
            raise ApiError("Record not found.", 404)
    return {"message": "Record deleted."}
