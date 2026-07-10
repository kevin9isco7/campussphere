from flask import Blueprint

from database.connection import db_cursor
from middleware.auth import require_auth

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.get("/summary")
@require_auth("dashboard.view")
def summary():
    cards = []
    queries = [
        ("Active Students", "SELECT COUNT(*) AS value FROM students WHERE status = 'Active'"),
        ("Teachers", "SELECT COUNT(*) AS value FROM teachers WHERE status = 'Active'"),
        ("Today Attendance", "SELECT COUNT(*) AS value FROM attendance WHERE attendance_date = CURDATE()"),
        ("Outstanding Fees", "SELECT COALESCE(SUM(amount), 0) AS value FROM invoices WHERE status IN ('Issued', 'Partially Paid', 'Overdue')"),
        ("Library Books", "SELECT COALESCE(SUM(available_copies), 0) AS value FROM library_books"),
        ("Transport Routes", "SELECT COUNT(*) AS value FROM transport_routes WHERE status = 'Active'"),
    ]
    with db_cursor() as cursor:
        for label, sql in queries:
            cursor.execute(sql)
            cards.append({"label": label, "value": cursor.fetchone()["value"]})

        cursor.execute("""
            SELECT status, COUNT(*) AS total
            FROM attendance
            WHERE attendance_date >= CURDATE() - INTERVAL 30 DAY
            GROUP BY status
        """)
        attendance = cursor.fetchall()

        cursor.execute("""
            SELECT status, COUNT(*) AS total
            FROM invoices
            GROUP BY status
        """)
        finance = cursor.fetchall()

        cursor.execute("""
            SELECT first_name, last_name, admission_no, created_at
            FROM students
            ORDER BY created_at DESC
            LIMIT 6
        """)
        recent_students = cursor.fetchall()

    return {
        "cards": cards,
        "charts": {
            "attendance": attendance,
            "finance": finance,
        },
        "recent_students": recent_students,
    }
