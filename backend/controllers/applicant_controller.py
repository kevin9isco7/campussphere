from decimal import Decimal, InvalidOperation
from uuid import uuid4

from flask import Blueprint, g, request
from werkzeug.utils import secure_filename

from database.connection import db_cursor
from middleware.auth import create_token, hash_password, require_auth
from middleware.errors import ApiError
from services.storage_service import storage_service

applicant_bp = Blueprint("applicants", __name__, url_prefix="/api")

ALLOWED_DOCUMENT_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "pdf"}
MAX_DOCUMENT_BYTES = 8 * 1024 * 1024
ADMITTED_STATUSES = {"Admitted", "Enrolled"}


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


def _require_applicant_schema(cursor):
    if not _column_exists(cursor, "admissions", "user_id"):
        raise ApiError("The student admission workflow database migration has not been applied.", 503)


def _application_no():
    return f"APP-{uuid4().hex[:10].upper()}"


def _split_name(full_name):
    parts = (full_name or "Student Applicant").split()
    first = parts[0] if parts else "Student"
    last = " ".join(parts[1:]) if len(parts) > 1 else "Applicant"
    return first, last


def _current_user_record(cursor):
    cursor.execute(
        "SELECT id, full_name, email, institution_type, portal_key FROM users WHERE id = %s LIMIT 1",
        (g.current_user["sub"],),
    )
    user = cursor.fetchone()
    if not user:
        raise ApiError("User account was not found.", 404)
    if user["portal_key"] != "student":
        raise ApiError("Only student portal accounts can access admission applications.", 403)
    return user


def _get_or_create_application(cursor, user):
    _require_applicant_schema(cursor)
    cursor.execute(
        "SELECT * FROM admissions WHERE user_id = %s ORDER BY id DESC LIMIT 1",
        (user["id"],),
    )
    application = cursor.fetchone()
    if application:
        return application

    first_name, last_name = _split_name(user["full_name"])
    cursor.execute(
        """
        INSERT INTO admissions (
          user_id, institution_type, application_no, first_name, last_name,
          date_of_birth, gender, grade_applied, guardian_name, guardian_phone,
          guardian_email, status, payment_status, registration_fee_amount
        )
        VALUES (%s, %s, %s, %s, %s, '2000-01-01', 'Other', 'Pending',
                'Pending', 'Pending', NULL, 'Draft', 'Not Paid', 0)
        """,
        (user["id"], user["institution_type"], _application_no(), first_name, last_name),
    )
    cursor.execute("SELECT * FROM admissions WHERE id = LAST_INSERT_ID()")
    return cursor.fetchone()


def _application_documents(cursor, admission_id):
    cursor.execute(
        """
        SELECT id, document_type, file_name, file_path, mime_type, status, notes, created_at
        FROM admission_documents
        WHERE admission_id = %s
        ORDER BY created_at DESC
        """,
        (admission_id,),
    )
    return cursor.fetchall()


def _serialize_application(application, documents=None):
    status = application.get("status")
    return {
        "id": application["id"],
        "application_no": application["application_no"],
        "institution": application.get("institution_type"),
        "first_name": application["first_name"],
        "last_name": application["last_name"],
        "date_of_birth": str(application["date_of_birth"]) if application.get("date_of_birth") else "",
        "gender": application["gender"],
        "grade_applied": application["grade_applied"],
        "guardian_name": application["guardian_name"],
        "guardian_phone": application["guardian_phone"],
        "guardian_email": application.get("guardian_email") or "",
        "status": status,
        "payment_status": application.get("payment_status") or "Not Paid",
        "registration_fee_amount": str(application.get("registration_fee_amount") or "0.00"),
        "registration_fee_reference": application.get("registration_fee_reference") or "",
        "submitted_at": str(application.get("submitted_at") or ""),
        "verified_at": str(application.get("verified_at") or ""),
        "verification_notes": application.get("verification_notes") or "",
        "notes": application.get("notes") or "",
        "requires_application": status not in ADMITTED_STATUSES,
        "documents": documents or [],
    }


def _extension(filename):
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def _option(label, value=None, group=None):
    cleaned_label = str(label or "").strip()
    if not cleaned_label:
        return None
    return {
        "label": cleaned_label,
        "value": str(value or cleaned_label).strip(),
        "group": str(group or "").strip(),
    }


@applicant_bp.get("/applicant/options")
def applicant_options():
    institution = (request.args.get("institution") or "").strip().lower()
    if institution not in {"secondary", "university"}:
        raise ApiError("Institution must be secondary or university.", 422)

    options = []
    with db_cursor() as cursor:
        if institution == "secondary":
            cursor.execute(
                """
                SELECT code, name, department
                FROM subjects
                ORDER BY department IS NULL, department, name
                """
            )
            for row in cursor.fetchall():
                label = row["name"]
                if row.get("code"):
                    label = f"{row['name']} ({row['code']})"
                option = _option(label, row["name"], row.get("department"))
                if option:
                    options.append(option)
        else:
            cursor.execute(
                """
                SELECT DISTINCT department
                FROM subjects
                WHERE department IS NOT NULL AND TRIM(department) <> ''
                ORDER BY department
                """
            )
            seen = set()
            for row in cursor.fetchall():
                option = _option(row["department"], row["department"], "Faculty / Department")
                if option and option["value"].lower() not in seen:
                    seen.add(option["value"].lower())
                    options.append(option)

            cursor.execute(
                """
                SELECT code, name, department
                FROM subjects
                ORDER BY department IS NULL, department, name
                """
            )
            for row in cursor.fetchall():
                label = row["name"]
                if row.get("department"):
                    label = f"{row['department']} - {row['name']}"
                if row.get("code"):
                    label = f"{label} ({row['code']})"
                option = _option(label, row["name"], row.get("department") or "Programme")
                if option and option["value"].lower() not in seen:
                    seen.add(option["value"].lower())
                    options.append(option)

    return {
        "institution": institution,
        "field": "grade_applied",
        "label": "Programme / Faculty applying for" if institution == "university" else "Subject applying for",
        "options": options,
    }


@applicant_bp.post("/applicants/register")
def register_applicant():
    data = request.get_json(silent=True) or {}
    institution = (data.get("institution") or "").strip().lower()
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    desired_level = (data.get("desired_level") or "Pending").strip() or "Pending"
    password = data.get("password") or ""

    errors = {}
    if institution not in {"secondary", "university"}:
        errors["institution"] = "Select Secondary School or University."
    if not first_name:
        errors["first_name"] = "First name is required."
    if not last_name:
        errors["last_name"] = "Last name is required."
    if "@" not in email:
        errors["email"] = "A valid email is required."
    if len(password) < 8:
        errors["password"] = "Password must be at least 8 characters."
    if errors:
        raise ApiError("Please correct the highlighted fields.", 422, errors)

    with db_cursor(commit=True) as cursor:
        _require_applicant_schema(cursor)
        cursor.execute("SELECT id FROM users WHERE email = %s LIMIT 1", (email,))
        if cursor.fetchone():
            raise ApiError("An account already exists for this email.", 409)
        cursor.execute("SELECT id, role_key, name AS role_name FROM roles WHERE role_key = 'student' LIMIT 1")
        role = cursor.fetchone()
        if not role:
            raise ApiError("Student role is not configured.", 503)

        full_name = f"{first_name} {last_name}".strip()
        cursor.execute(
            """
            INSERT INTO users (role_id, full_name, email, password_hash, institution_type, portal_key, status)
            VALUES (%s, %s, %s, %s, %s, 'student', 'Active')
            """,
            (role["id"], full_name, email, hash_password(password), institution),
        )
        user_id = cursor.lastrowid
        cursor.execute(
            """
            INSERT INTO admissions (
              user_id, institution_type, application_no, first_name, last_name,
              date_of_birth, gender, grade_applied, guardian_name, guardian_phone,
              guardian_email, status, payment_status, registration_fee_amount
            )
            VALUES (%s, %s, %s, %s, %s, '2000-01-01', 'Other', %s,
                    'Pending', %s, NULL, 'Draft', 'Not Paid', 0)
            """,
            (user_id, institution, _application_no(), first_name, last_name, desired_level, phone or "Pending"),
        )
        application_id = cursor.lastrowid
        user = {
            "id": user_id,
            "full_name": full_name,
            "email": email,
            "role_key": "student",
            "role_name": role["role_name"],
            "institution_type": institution,
            "portal_key": "student",
        }

    return {
        "token": create_token(user),
        "user": {
            "id": user["id"],
            "name": user["full_name"],
            "email": user["email"],
            "role": "student",
            "role_name": user["role_name"],
            "institution": institution,
            "portal": "student",
        },
        "applicant": {
            "application_id": application_id,
            "status": "Draft",
            "requires_application": True,
        },
    }, 201


@applicant_bp.get("/applicant/application")
@require_auth()
def get_application():
    with db_cursor(commit=True) as cursor:
        user = _current_user_record(cursor)
        application = _get_or_create_application(cursor, user)
        documents = _application_documents(cursor, application["id"])
    return {"application": _serialize_application(application, documents)}


@applicant_bp.put("/applicant/application")
@require_auth()
def update_application():
    data = request.get_json(silent=True) or {}
    allowed = {
        "first_name", "last_name", "date_of_birth", "gender", "grade_applied",
        "guardian_name", "guardian_phone", "guardian_email", "notes",
    }
    payload = {key: (data.get(key) or "").strip() for key in allowed}
    errors = {}
    for field in ["first_name", "last_name", "date_of_birth", "gender", "grade_applied", "guardian_name", "guardian_phone"]:
        if not payload.get(field):
            errors[field] = "This field is required."
    if payload.get("gender") not in {"Female", "Male", "Other"}:
        errors["gender"] = "Select Female, Male, or Other."
    if errors:
        raise ApiError("Please complete the required application fields.", 422, errors)

    with db_cursor(commit=True) as cursor:
        user = _current_user_record(cursor)
        application = _get_or_create_application(cursor, user)
        if application["status"] in ADMITTED_STATUSES:
            raise ApiError("This application has already been admitted.", 409)
        cursor.execute(
            """
            UPDATE admissions
            SET first_name = %s,
                last_name = %s,
                date_of_birth = %s,
                gender = %s,
                grade_applied = %s,
                guardian_name = %s,
                guardian_phone = %s,
                guardian_email = NULLIF(%s, ''),
                notes = NULLIF(%s, '')
            WHERE id = %s
            """,
            (
                payload["first_name"],
                payload["last_name"],
                payload["date_of_birth"],
                payload["gender"],
                payload["grade_applied"],
                payload["guardian_name"],
                payload["guardian_phone"],
                payload.get("guardian_email", ""),
                payload.get("notes", ""),
                application["id"],
            ),
        )
        cursor.execute("SELECT * FROM admissions WHERE id = %s", (application["id"],))
        application = cursor.fetchone()
        documents = _application_documents(cursor, application["id"])
    return {"message": "Application saved.", "application": _serialize_application(application, documents)}


@applicant_bp.post("/applicant/documents")
@require_auth()
def upload_application_document():
    file = request.files.get("file")
    document_type = request.form.get("document_type") or "Other"
    if not file or not file.filename:
        raise ApiError("A document file is required.", 422)

    original_name = secure_filename(file.filename)
    ext = _extension(original_name)
    if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise ApiError("Unsupported document type.", 422, {"file": "Use PDF, PNG, JPG, or WEBP."})

    stream = file.stream
    stream.seek(0, 2)
    size = stream.tell()
    stream.seek(0)
    if size > MAX_DOCUMENT_BYTES:
        raise ApiError("Document is too large.", 422, {"file": "Maximum document size is 8 MB."})

    with db_cursor(commit=True) as cursor:
        user = _current_user_record(cursor)
        application = _get_or_create_application(cursor, user)
        safe_type = secure_filename(document_type).replace("_", "-").lower() or "document"
        stored_name = f"application-{application['id']}-{safe_type}-{uuid4().hex}.{ext}"
        public_path = storage_service.save_upload(file, "admission-documents", stored_name)
        cursor.execute(
            """
            INSERT INTO admission_documents (admission_id, document_type, file_name, file_path, mime_type)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (application["id"], document_type, original_name, public_path, file.mimetype),
        )
        documents = _application_documents(cursor, application["id"])
    return {"message": "Document uploaded.", "documents": documents}, 201


@applicant_bp.post("/applicant/registration-fee")
@require_auth()
def record_registration_fee():
    data = request.get_json(silent=True) or {}
    reference = (data.get("reference") or "").strip()
    try:
        amount = Decimal(str(data.get("amount") or "0"))
    except (InvalidOperation, ValueError) as exc:
        raise ApiError("Enter a valid registration fee amount.", 422) from exc
    if amount <= 0:
        raise ApiError("Registration fee amount must be greater than zero.", 422)
    if not reference:
        raise ApiError("Payment reference is required.", 422)

    with db_cursor(commit=True) as cursor:
        user = _current_user_record(cursor)
        application = _get_or_create_application(cursor, user)
        cursor.execute(
            """
            UPDATE admissions
            SET payment_status = 'Paid',
                registration_fee_amount = %s,
                registration_fee_reference = %s,
                registration_fee_paid_at = NOW(),
                status = CASE WHEN status = 'Draft' THEN 'Payment Pending' ELSE status END
            WHERE id = %s
            """,
            (amount, reference, application["id"]),
        )
        cursor.execute("SELECT * FROM admissions WHERE id = %s", (application["id"],))
        application = cursor.fetchone()
        documents = _application_documents(cursor, application["id"])
    return {"message": "Non-refundable registration fee recorded.", "application": _serialize_application(application, documents)}


@applicant_bp.post("/applicant/submit")
@require_auth()
def submit_application():
    with db_cursor(commit=True) as cursor:
        user = _current_user_record(cursor)
        application = _get_or_create_application(cursor, user)
        missing = {}
        for field in ["first_name", "last_name", "date_of_birth", "grade_applied", "guardian_name", "guardian_phone"]:
            if not application.get(field) or str(application.get(field)).lower() == "pending":
                missing[field] = "Required before submission."
        if application.get("payment_status") != "Paid":
            missing["registration_fee"] = "Pay the non-refundable registration fee before submitting."
        documents = _application_documents(cursor, application["id"])
        if not documents:
            missing["documents"] = "Upload at least one supporting document."
        if missing:
            raise ApiError("Complete the application before submitting.", 422, missing)

        cursor.execute(
            """
            UPDATE admissions
            SET status = 'Submitted',
                submitted_at = NOW()
            WHERE id = %s
            """,
            (application["id"],),
        )
        cursor.execute("SELECT * FROM admissions WHERE id = %s", (application["id"],))
        application = cursor.fetchone()
        documents = _application_documents(cursor, application["id"])
    return {"message": "Application submitted. Please wait while the school verifies your documents.", "application": _serialize_application(application, documents)}
