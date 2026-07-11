-- CampusSphere non-destructive migration.
-- Purpose:
-- 1. Separate secondary-school and university records by institution_type.
-- 2. Allow institution-specific settings such as logos, colors, and backgrounds.
-- 3. Preserve existing live data. This migration does not DROP, TRUNCATE, or DELETE records.
--
-- Run this against the selected CampusSphere database after taking a backup.

DELIMITER //

DROP PROCEDURE IF EXISTS campussphere_add_column//
CREATE PROCEDURE campussphere_add_column(
  IN table_name_value VARCHAR(64),
  IN column_name_value VARCHAR(64),
  IN column_definition_value TEXT
)
BEGIN
  IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
  ) AND NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
      AND COLUMN_NAME = column_name_value
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', table_name_value, '` ADD COLUMN `', column_name_value, '` ', column_definition_value);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//

DROP PROCEDURE IF EXISTS campussphere_add_index//
CREATE PROCEDURE campussphere_add_index(
  IN table_name_value VARCHAR(64),
  IN index_name_value VARCHAR(64),
  IN index_definition_value TEXT
)
BEGIN
  IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
  ) AND NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
      AND INDEX_NAME = index_name_value
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', table_name_value, '` ADD ', index_definition_value);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//

DROP PROCEDURE IF EXISTS campussphere_drop_unique_index//
CREATE PROCEDURE campussphere_drop_unique_index(
  IN table_name_value VARCHAR(64),
  IN index_name_value VARCHAR(64)
)
BEGIN
  IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_value
      AND INDEX_NAME = index_name_value
      AND NON_UNIQUE = 0
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', table_name_value, '` DROP INDEX `', index_name_value, '`');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//

DELIMITER ;

CALL campussphere_add_column('school_settings', 'institution_type', "ENUM('global','secondary','university') NOT NULL DEFAULT 'global' AFTER id");
CALL campussphere_drop_unique_index('school_settings', 'setting_key');
CALL campussphere_add_index('school_settings', 'uq_school_settings_scope_key', 'UNIQUE INDEX uq_school_settings_scope_key (institution_type, setting_key)');
CALL campussphere_add_index('school_settings', 'idx_school_settings_scope', 'INDEX idx_school_settings_scope (institution_type)');

CALL campussphere_add_column('academic_years', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('admissions', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('teachers', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('classes', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('students', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('parents', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('subjects', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('curriculum', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('attendance', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('timetable_entries', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('assignments', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('examinations', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('exam_results', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('invoices', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('payments', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('employees', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('payroll', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('library_books', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('library_loans', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('hostel_rooms', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('hostel_allocations', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('transport_routes', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('transport_assignments', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('messages', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('school_announcements', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('sms_reports', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('canteen_orders', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('fee_receipts', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('expenses', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('scholarships', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('saved_reports', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");
CALL campussphere_add_column('audit_logs', 'institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER id");

CALL campussphere_add_index('academic_years', 'idx_academic_years_institution_type', 'INDEX idx_academic_years_institution_type (institution_type)');
CALL campussphere_add_index('admissions', 'idx_admissions_institution_type', 'INDEX idx_admissions_institution_type (institution_type)');
CALL campussphere_add_index('teachers', 'idx_teachers_institution_type', 'INDEX idx_teachers_institution_type (institution_type)');
CALL campussphere_add_index('classes', 'idx_classes_institution_type', 'INDEX idx_classes_institution_type (institution_type)');
CALL campussphere_add_index('students', 'idx_students_institution_type', 'INDEX idx_students_institution_type (institution_type)');
CALL campussphere_add_index('parents', 'idx_parents_institution_type', 'INDEX idx_parents_institution_type (institution_type)');
CALL campussphere_add_index('subjects', 'idx_subjects_institution_type', 'INDEX idx_subjects_institution_type (institution_type)');
CALL campussphere_add_index('curriculum', 'idx_curriculum_institution_type', 'INDEX idx_curriculum_institution_type (institution_type)');
CALL campussphere_add_index('attendance', 'idx_attendance_institution_type', 'INDEX idx_attendance_institution_type (institution_type)');
CALL campussphere_add_index('timetable_entries', 'idx_timetable_entries_institution_type', 'INDEX idx_timetable_entries_institution_type (institution_type)');
CALL campussphere_add_index('assignments', 'idx_assignments_institution_type', 'INDEX idx_assignments_institution_type (institution_type)');
CALL campussphere_add_index('examinations', 'idx_examinations_institution_type', 'INDEX idx_examinations_institution_type (institution_type)');
CALL campussphere_add_index('exam_results', 'idx_exam_results_institution_type', 'INDEX idx_exam_results_institution_type (institution_type)');
CALL campussphere_add_index('invoices', 'idx_invoices_institution_type', 'INDEX idx_invoices_institution_type (institution_type)');
CALL campussphere_add_index('payments', 'idx_payments_institution_type', 'INDEX idx_payments_institution_type (institution_type)');
CALL campussphere_add_index('employees', 'idx_employees_institution_type', 'INDEX idx_employees_institution_type (institution_type)');
CALL campussphere_add_index('payroll', 'idx_payroll_institution_type', 'INDEX idx_payroll_institution_type (institution_type)');
CALL campussphere_add_index('library_books', 'idx_library_books_institution_type', 'INDEX idx_library_books_institution_type (institution_type)');
CALL campussphere_add_index('library_loans', 'idx_library_loans_institution_type', 'INDEX idx_library_loans_institution_type (institution_type)');
CALL campussphere_add_index('hostel_rooms', 'idx_hostel_rooms_institution_type', 'INDEX idx_hostel_rooms_institution_type (institution_type)');
CALL campussphere_add_index('hostel_allocations', 'idx_hostel_allocations_institution_type', 'INDEX idx_hostel_allocations_institution_type (institution_type)');
CALL campussphere_add_index('transport_routes', 'idx_transport_routes_institution_type', 'INDEX idx_transport_routes_institution_type (institution_type)');
CALL campussphere_add_index('transport_assignments', 'idx_transport_assignments_institution_type', 'INDEX idx_transport_assignments_institution_type (institution_type)');
CALL campussphere_add_index('messages', 'idx_messages_institution_type', 'INDEX idx_messages_institution_type (institution_type)');
CALL campussphere_add_index('school_announcements', 'idx_school_announcements_institution_type', 'INDEX idx_school_announcements_institution_type (institution_type)');
CALL campussphere_add_index('sms_reports', 'idx_sms_reports_institution_type', 'INDEX idx_sms_reports_institution_type (institution_type)');
CALL campussphere_add_index('canteen_orders', 'idx_canteen_orders_institution_type', 'INDEX idx_canteen_orders_institution_type (institution_type)');
CALL campussphere_add_index('fee_receipts', 'idx_fee_receipts_institution_type', 'INDEX idx_fee_receipts_institution_type (institution_type)');
CALL campussphere_add_index('expenses', 'idx_expenses_institution_type', 'INDEX idx_expenses_institution_type (institution_type)');
CALL campussphere_add_index('scholarships', 'idx_scholarships_institution_type', 'INDEX idx_scholarships_institution_type (institution_type)');
CALL campussphere_add_index('saved_reports', 'idx_saved_reports_institution_type', 'INDEX idx_saved_reports_institution_type (institution_type)');
CALL campussphere_add_index('audit_logs', 'idx_audit_logs_institution_type', 'INDEX idx_audit_logs_institution_type (institution_type)');

INSERT INTO roles (role_key, name, description) VALUES
('lecturer', 'Lecturer', 'University lecturer portal and academic access'),
('dean', 'Dean', 'Faculty dean academic oversight'),
('hod', 'Head of Department', 'Department academic leadership')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.permission_key IN
('dashboard.view','students.manage','academic.manage','attendance.manage','exams.manage','communication.manage','reports.view')
WHERE r.role_key = 'lecturer'
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.permission_key IN
('dashboard.view','students.manage','teachers.manage','academic.manage','exams.manage','reports.view')
WHERE r.role_key = 'dean'
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.permission_key IN
('dashboard.view','teachers.manage','academic.manage','attendance.manage','exams.manage','communication.manage','reports.view')
WHERE r.role_key = 'hod'
ON DUPLICATE KEY UPDATE role_id = role_id;

UPDATE users
SET institution_type = 'global', portal_key = 'administrator'
WHERE email = 'admin@school.local';

INSERT INTO users (role_id, full_name, email, password_hash, institution_type, portal_key, status)
SELECT r.id, seed.full_name, seed.email,
'pbkdf2_sha256$campusphere_portal_seed_2026$69df8a8da40b2f8218fa70e325ebe290b9ca6c605ff24f9ba1cbf8cd219a28f6',
seed.institution_type, seed.portal_key, 'Active'
FROM (
  SELECT 'student' AS role_key, 'Secondary Student' AS full_name, 'secondary.student@campus.local' AS email, 'secondary' AS institution_type, 'student' AS portal_key
  UNION ALL SELECT 'teacher', 'Secondary Teacher', 'secondary.teacher@campus.local', 'secondary', 'teacher'
  UNION ALL SELECT 'parent', 'Secondary Parent', 'secondary.parent@campus.local', 'secondary', 'parent'
  UNION ALL SELECT 'administrator', 'Secondary Administrator', 'secondary.admin@campus.local', 'secondary', 'administrator'
  UNION ALL SELECT 'accountant', 'Secondary Accountant', 'secondary.accountant@campus.local', 'secondary', 'accountant'
  UNION ALL SELECT 'librarian', 'Secondary Librarian', 'secondary.librarian@campus.local', 'secondary', 'librarian'
  UNION ALL SELECT 'hr', 'Secondary HR Officer', 'secondary.hr@campus.local', 'secondary', 'hr'
  UNION ALL SELECT 'student', 'University Student', 'university.student@campus.local', 'university', 'student'
  UNION ALL SELECT 'lecturer', 'University Lecturer', 'university.lecturer@campus.local', 'university', 'lecturer'
  UNION ALL SELECT 'administrator', 'University Administrator', 'university.admin@campus.local', 'university', 'administrator'
  UNION ALL SELECT 'registrar', 'University Registrar', 'university.registrar@campus.local', 'university', 'registrar'
  UNION ALL SELECT 'dean', 'University Dean', 'university.dean@campus.local', 'university', 'dean'
  UNION ALL SELECT 'hod', 'University Head of Department', 'university.hod@campus.local', 'university', 'hod'
  UNION ALL SELECT 'accountant', 'University Accountant', 'university.accountant@campus.local', 'university', 'accountant'
  UNION ALL SELECT 'librarian', 'University Librarian', 'university.librarian@campus.local', 'university', 'librarian'
  UNION ALL SELECT 'hr', 'University HR Officer', 'university.hr@campus.local', 'university', 'hr'
) seed
JOIN roles r ON r.role_key = seed.role_key
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  institution_type = VALUES(institution_type),
  portal_key = VALUES(portal_key),
  status = VALUES(status),
  role_id = VALUES(role_id);

DROP PROCEDURE IF EXISTS campussphere_add_column;
DROP PROCEDURE IF EXISTS campussphere_add_index;
DROP PROCEDURE IF EXISTS campussphere_drop_unique_index;
