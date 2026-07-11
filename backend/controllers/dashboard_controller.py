from flask import Blueprint, g

from database.connection import db_cursor
from middleware.auth import require_auth

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")
INSTITUTION_TYPES = {"secondary", "university"}
_COLUMN_CACHE = {}


def _current_institution():
    institution = (getattr(g, "current_user", {}) or {}).get("institution")
    return institution if institution in INSTITUTION_TYPES else None


def _table_has_column(cursor, table, column):
    cache_key = (table, column)
    if cache_key not in _COLUMN_CACHE:
        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = %s
              AND COLUMN_NAME = %s
            """,
            (table, column),
        )
        _COLUMN_CACHE[cache_key] = cursor.fetchone()["total"] > 0
    return _COLUMN_CACHE[cache_key]


def _scoped_where(cursor, table, conditions=None):
    conditions = list(conditions or [])
    params = []
    institution = _current_institution()
    if institution and _table_has_column(cursor, table, "institution_type"):
        conditions.append("institution_type = %s")
        params.append(institution)
    return (" WHERE " + " AND ".join(conditions) if conditions else ""), params


@dashboard_bp.get("/summary")
@require_auth("dashboard.view")
def summary():
    cards = []
    queries = [
        ("Active Students", "students", "COUNT(*)", ["status = 'Active'"]),
        ("Teachers", "teachers", "COUNT(*)", ["status = 'Active'"]),
        ("Today Attendance", "attendance", "COUNT(*)", ["attendance_date = CURDATE()"]),
        ("Outstanding Fees", "invoices", "COALESCE(SUM(amount), 0)", ["status IN ('Issued', 'Partially Paid', 'Overdue')"]),
        ("Library Books", "library_books", "COALESCE(SUM(available_copies), 0)", []),
        ("Transport Routes", "transport_routes", "COUNT(*)", ["status = 'Active'"]),
    ]
    with db_cursor() as cursor:
        for label, table, aggregate, conditions in queries:
            where_sql, params = _scoped_where(cursor, table, conditions)
            cursor.execute(f"SELECT {aggregate} AS value FROM {table}{where_sql}", params)
            cards.append({"label": label, "value": cursor.fetchone()["value"]})

        attendance_where, attendance_params = _scoped_where(
            cursor,
            "attendance",
            ["attendance_date >= CURDATE() - INTERVAL 30 DAY"],
        )
        cursor.execute(f"""
            SELECT status, COUNT(*) AS total
            FROM attendance
            {attendance_where}
            GROUP BY status
        """, attendance_params)
        attendance = cursor.fetchall()

        finance_where, finance_params = _scoped_where(cursor, "invoices")
        cursor.execute(f"""
            SELECT status, COUNT(*) AS total
            FROM invoices
            {finance_where}
            GROUP BY status
        """, finance_params)
        finance = cursor.fetchall()

        students_where, students_params = _scoped_where(cursor, "students")
        cursor.execute(f"""
            SELECT first_name, last_name, admission_no, created_at
            FROM students
            {students_where}
            ORDER BY created_at DESC
            LIMIT 6
        """, students_params)
        recent_students = cursor.fetchall()

    return {
        "cards": cards,
        "charts": {
            "attendance": attendance,
            "finance": finance,
        },
        "recent_students": recent_students,
    }
