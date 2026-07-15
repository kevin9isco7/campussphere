from flask import Blueprint, request

from database.connection import db_cursor
from middleware.auth import create_token, require_auth, verify_password
from middleware.errors import ApiError

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _column_exists(cursor, table_name, column_name):
    cursor.execute(
        """
        SELECT 1
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = %s
          AND COLUMN_NAME = %s
        LIMIT 1
        """,
        (table_name, column_name),
    )
    return cursor.fetchone() is not None


def _student_applicant_context(user_id, role_key, portal_key):
    if role_key != "student" or portal_key != "student":
        return None
    with db_cursor() as cursor:
        if not _column_exists(cursor, "admissions", "user_id"):
            return None
        cursor.execute(
            """
            SELECT id, status, payment_status
            FROM admissions
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (user_id,),
        )
        application = cursor.fetchone()
    if not application:
        return None
    return {
        "application_id": application["id"],
        "status": application["status"],
        "payment_status": application.get("payment_status"),
        "requires_application": application["status"] not in {"Admitted", "Enrolled"},
    }


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    institution_type = (data.get("institution") or "").strip().lower()
    portal_key = (data.get("portal_role") or "").strip().lower()
    if not email or not password:
        raise ApiError("Email and password are required.", 422)

    sql = """
        SELECT
            u.id,
            u.full_name,
            u.email,
            u.password_hash,
            u.status,
            u.institution_type,
            u.portal_key,
            r.role_key,
            r.name AS role_name
        FROM users u
        JOIN roles r ON r.id = u.role_id
        WHERE u.email = %s
        LIMIT 1
    """
    with db_cursor(commit=True) as cursor:
        cursor.execute(sql, (email,))
        user = cursor.fetchone()
        if not user or user["status"] != "Active" or not verify_password(password, user["password_hash"]):
            raise ApiError("Invalid email or password.", 401)
        if institution_type and user["institution_type"] not in (institution_type, "global"):
            raise ApiError("This account is not assigned to the selected institution.", 403)
        if portal_key and user["portal_key"] not in (portal_key, "global"):
            raise ApiError("This account is not assigned to the selected portal.", 403)
        cursor.execute("UPDATE users SET last_login_at = NOW() WHERE id = %s", (user["id"],))

    token = create_token(user)
    applicant = _student_applicant_context(user["id"], user["role_key"], user["portal_key"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["full_name"],
            "email": user["email"],
            "role": user["role_key"],
            "role_name": user["role_name"],
            "institution": user["institution_type"],
            "portal": user["portal_key"],
        },
        "applicant": applicant,
    }


@auth_bp.get("/me")
@require_auth()
def me():
    from flask import g

    return {
        "user": g.current_user,
        "permissions": sorted(g.permissions),
    }
