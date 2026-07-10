from flask import Blueprint, request

from database.connection import db_cursor
from middleware.auth import require_auth
from middleware.errors import ApiError

report_bp = Blueprint("reports_api", __name__, url_prefix="/api/reports")

REPORT_SQL = {
    "attendance": """
        SELECT a.attendance_date, s.admission_no, s.first_name, s.last_name, c.name AS class_name, a.status, a.remarks
        FROM attendance a
        JOIN students s ON s.id = a.student_id
        JOIN classes c ON c.id = a.class_id
        WHERE (%s IS NULL OR a.attendance_date >= %s)
          AND (%s IS NULL OR a.attendance_date <= %s)
        ORDER BY a.attendance_date DESC
    """,
    "students": """
        SELECT s.admission_no, s.first_name, s.last_name, c.name AS class_name, s.status, s.created_at
        FROM students s
        LEFT JOIN classes c ON c.id = s.class_id
        ORDER BY s.created_at DESC
    """,
    "teachers": """
        SELECT employee_no, first_name, last_name, department, qualification, status
        FROM teachers
        ORDER BY last_name ASC
    """,
    "finance": """
        SELECT i.invoice_no, s.admission_no, s.first_name, s.last_name, i.amount, i.due_date, i.status
        FROM invoices i
        JOIN students s ON s.id = i.student_id
        ORDER BY i.due_date DESC
    """,
    "library": """
        SELECT isbn, title, author, category, total_copies, available_copies, shelf_location
        FROM library_books
        ORDER BY title ASC
    """,
    "hostel": """
        SELECT hostel_name, room_no, room_type, capacity, occupied, status
        FROM hostel_rooms
        ORDER BY hostel_name, room_no
    """,
    "transport": """
        SELECT route_name, vehicle_no, driver_name, driver_phone, monthly_fee, status
        FROM transport_routes
        ORDER BY route_name
    """,
    "exams": """
        SELECT e.name AS exam_name, s.admission_no, s.first_name, s.last_name, sub.name AS subject, r.score, r.grade, r.remarks
        FROM exam_results r
        JOIN examinations e ON e.id = r.exam_id
        JOIN students s ON s.id = r.student_id
        JOIN subjects sub ON sub.id = r.subject_id
        ORDER BY e.starts_on DESC, s.last_name
    """,
}


@report_bp.get("/<report_type>")
@require_auth("reports.view")
def run_report(report_type):
    sql = REPORT_SQL.get(report_type)
    if not sql:
        raise ApiError("Unknown report type.", 404)
    start = request.args.get("start") or None
    end = request.args.get("end") or None
    params = (start, start, end, end) if report_type == "attendance" else ()
    with db_cursor() as cursor:
        cursor.execute(sql, params)
        rows = cursor.fetchall()
    return {"report": report_type, "rows": rows}
