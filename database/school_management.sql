CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_management;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS school_profiles;
DROP TABLE IF EXISTS scholarships;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS fee_receipts;
DROP TABLE IF EXISTS canteen_orders;
DROP TABLE IF EXISTS sms_reports;
DROP TABLE IF EXISTS school_announcements;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS saved_reports;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS transport_assignments;
DROP TABLE IF EXISTS transport_routes;
DROP TABLE IF EXISTS hostel_allocations;
DROP TABLE IF EXISTS hostel_rooms;
DROP TABLE IF EXISTS library_loans;
DROP TABLE IF EXISTS library_books;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS exam_results;
DROP TABLE IF EXISTS examinations;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS timetable_entries;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS curriculum;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS parents;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS admissions;
DROP TABLE IF EXISTS academic_years;
DROP TABLE IF EXISTS school_settings;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_key VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE permissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  permission_key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  role_id INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id INT UNSIGNED NOT NULL,
  full_name VARCHAR(180) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  institution_type ENUM('global','secondary','university') NOT NULL DEFAULT 'global',
  portal_key VARCHAR(80) NOT NULL DEFAULT 'global',
  status ENUM('Active','Suspended','Disabled') NOT NULL DEFAULT 'Active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
  INDEX idx_users_role_status (role_id, status),
  INDEX idx_users_institution_portal (institution_type, portal_key)
) ENGINE=InnoDB;

CREATE TABLE school_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE academic_years (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  status ENUM('Planning','Current','Closed') NOT NULL DEFAULT 'Planning',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (starts_on < ends_on),
  INDEX idx_academic_years_status (status)
) ENGINE=InnoDB;

CREATE TABLE admissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_no VARCHAR(80) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('Female','Male','Other') NOT NULL,
  grade_applied VARCHAR(60) NOT NULL,
  guardian_name VARCHAR(180) NOT NULL,
  guardian_phone VARCHAR(40) NOT NULL,
  guardian_email VARCHAR(190) NULL,
  status ENUM('Submitted','Reviewed','Accepted','Rejected','Enrolled') NOT NULL DEFAULT 'Submitted',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admissions_status (status),
  INDEX idx_admissions_name (last_name, first_name)
) ENGINE=InnoDB;

CREATE TABLE teachers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  employee_no VARCHAR(80) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(40) NULL,
  department VARCHAR(120) NULL,
  qualification VARCHAR(180) NULL,
  hire_date DATE NULL,
  status ENUM('Active','On Leave','Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_teachers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_teachers_department (department),
  INDEX idx_teachers_status (status)
) ENGINE=InnoDB;

CREATE TABLE classes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  academic_year_id INT UNSIGNED NULL,
  teacher_id INT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  grade_level VARCHAR(60) NOT NULL,
  room VARCHAR(60) NULL,
  capacity INT UNSIGNED NOT NULL DEFAULT 40,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_classes_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL,
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  UNIQUE KEY uq_classes_year_name (academic_year_id, name),
  INDEX idx_classes_grade (grade_level)
) ENGINE=InnoDB;

CREATE TABLE students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  class_id INT UNSIGNED NULL,
  admission_id INT UNSIGNED NULL,
  admission_no VARCHAR(80) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('Female','Male','Other') NOT NULL,
  email VARCHAR(190) NULL UNIQUE,
  phone VARCHAR(40) NULL,
  address TEXT NULL,
  status ENUM('Active','Inactive','Graduated','Transferred') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_admission FOREIGN KEY (admission_id) REFERENCES admissions(id) ON DELETE SET NULL,
  INDEX idx_students_class_status (class_id, status),
  INDEX idx_students_name (last_name, first_name)
) ENGINE=InnoDB;

CREATE TABLE parents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  student_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  relationship ENUM('Mother','Father','Guardian','Sponsor') NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(190) NULL,
  occupation VARCHAR(120) NULL,
  address TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_parents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_parents_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_parents_student (student_id),
  INDEX idx_parents_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE subjects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  department VARCHAR(120) NULL,
  credit_hours INT UNSIGNED NOT NULL DEFAULT 1,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subjects_department (department)
) ENGINE=InnoDB;

CREATE TABLE curriculum (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  grade_level VARCHAR(60) NOT NULL,
  term VARCHAR(60) NOT NULL,
  objectives TEXT NULL,
  status ENUM('Draft','Approved','Archived') NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_curriculum_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
  INDEX idx_curriculum_grade_term (grade_level, term),
  INDEX idx_curriculum_status (status)
) ENGINE=InnoDB;

CREATE TABLE attendance (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id INT UNSIGNED NOT NULL,
  class_id INT UNSIGNED NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present','Absent','Late','Excused') NOT NULL,
  remarks TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_attendance_student_date (student_id, attendance_date),
  INDEX idx_attendance_date_status (attendance_date, status)
) ENGINE=InnoDB;

CREATE TABLE timetable_entries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  class_id INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  teacher_id INT UNSIGNED NOT NULL,
  weekday ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  starts_at TIME NOT NULL,
  ends_at TIME NOT NULL,
  room VARCHAR(60) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_timetable_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_timetable_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
  CONSTRAINT fk_timetable_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  CHECK (starts_at < ends_at),
  INDEX idx_timetable_class_day (class_id, weekday)
) ENGINE=InnoDB;

CREATE TABLE assignments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  class_id INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  teacher_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  due_date DATE NOT NULL,
  status ENUM('Draft','Published','Closed') NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_assignments_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_assignments_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
  CONSTRAINT fk_assignments_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  INDEX idx_assignments_due_status (due_date, status)
) ENGINE=InnoDB;

CREATE TABLE examinations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  exam_type ENUM('CAT','Midterm','Final','Mock','Practical') NOT NULL,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  status ENUM('Scheduled','Running','Completed','Published') NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (starts_on <= ends_on),
  INDEX idx_examinations_status (status)
) ENGINE=InnoDB;

CREATE TABLE exam_results (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  remarks TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_results_exam FOREIGN KEY (exam_id) REFERENCES examinations(id) ON DELETE CASCADE,
  CONSTRAINT fk_results_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_results_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
  UNIQUE KEY uq_exam_student_subject (exam_id, student_id, subject_id),
  CHECK (score >= 0 AND score <= 100),
  INDEX idx_results_student (student_id)
) ENGINE=InnoDB;

CREATE TABLE invoices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_no VARCHAR(80) NOT NULL UNIQUE,
  student_id INT UNSIGNED NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('Draft','Issued','Partially Paid','Paid','Overdue','Cancelled') NOT NULL DEFAULT 'Draft',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoices_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CHECK (amount >= 0),
  INDEX idx_invoices_student_status (student_id, status),
  INDEX idx_invoices_due (due_date)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT UNSIGNED NOT NULL,
  receipt_no VARCHAR(80) NOT NULL UNIQUE,
  amount DECIMAL(12,2) NOT NULL,
  paid_on DATE NOT NULL,
  method ENUM('Cash','Bank','Mobile Money','Card','Cheque') NOT NULL,
  reference VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  CHECK (amount > 0),
  INDEX idx_payments_paid_on (paid_on)
) ENGINE=InnoDB;

CREATE TABLE employees (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  employee_no VARCHAR(80) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  department VARCHAR(120) NOT NULL,
  position VARCHAR(120) NOT NULL,
  email VARCHAR(190) NULL UNIQUE,
  phone VARCHAR(40) NULL,
  hire_date DATE NULL,
  status ENUM('Active','On Leave','Inactive','Exited') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_employees_department (department),
  INDEX idx_employees_status (status)
) ENGINE=InnoDB;

CREATE TABLE payroll (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  pay_period VARCHAR(40) NOT NULL,
  gross_pay DECIMAL(12,2) NOT NULL,
  deductions DECIMAL(12,2) NOT NULL DEFAULT 0,
  net_pay DECIMAL(12,2) NOT NULL,
  status ENUM('Draft','Approved','Paid') NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY uq_payroll_employee_period (employee_id, pay_period),
  CHECK (gross_pay >= 0 AND deductions >= 0 AND net_pay >= 0),
  INDEX idx_payroll_status (status)
) ENGINE=InnoDB;

CREATE TABLE library_books (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(40) NOT NULL UNIQUE,
  title VARCHAR(220) NOT NULL,
  author VARCHAR(180) NOT NULL,
  category VARCHAR(120) NULL,
  total_copies INT UNSIGNED NOT NULL DEFAULT 1,
  available_copies INT UNSIGNED NOT NULL DEFAULT 1,
  shelf_location VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (available_copies <= total_copies),
  INDEX idx_library_category (category),
  INDEX idx_library_title (title)
) ENGINE=InnoDB;

CREATE TABLE library_loans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  book_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  issued_on DATE NOT NULL,
  due_on DATE NOT NULL,
  returned_on DATE NULL,
  status ENUM('Issued','Returned','Overdue','Lost') NOT NULL DEFAULT 'Issued',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_library_loans_book FOREIGN KEY (book_id) REFERENCES library_books(id) ON DELETE CASCADE,
  CONSTRAINT fk_library_loans_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CHECK (issued_on <= due_on),
  INDEX idx_library_loans_status (status),
  INDEX idx_library_loans_student (student_id)
) ENGINE=InnoDB;

CREATE TABLE hostel_rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hostel_name VARCHAR(140) NOT NULL,
  room_no VARCHAR(40) NOT NULL,
  room_type ENUM('Single','Double','Dormitory') NOT NULL,
  capacity INT UNSIGNED NOT NULL,
  occupied INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('Available','Full','Maintenance') NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_hostel_room (hostel_name, room_no),
  CHECK (occupied <= capacity),
  INDEX idx_hostel_status (status)
) ENGINE=InnoDB;

CREATE TABLE hostel_allocations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  allocated_on DATE NOT NULL,
  released_on DATE NULL,
  status ENUM('Active','Released') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hostel_allocations_room FOREIGN KEY (room_id) REFERENCES hostel_rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_hostel_allocations_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_hostel_allocations_status (status)
) ENGINE=InnoDB;

CREATE TABLE transport_routes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  route_name VARCHAR(160) NOT NULL UNIQUE,
  vehicle_no VARCHAR(80) NOT NULL,
  driver_name VARCHAR(160) NOT NULL,
  driver_phone VARCHAR(40) NULL,
  monthly_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('Active','Maintenance','Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (monthly_fee >= 0),
  INDEX idx_transport_status (status)
) ENGINE=InnoDB;

CREATE TABLE transport_assignments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  route_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  pickup_point VARCHAR(180) NOT NULL,
  status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transport_assignments_route FOREIGN KEY (route_id) REFERENCES transport_routes(id) ON DELETE CASCADE,
  CONSTRAINT fk_transport_assignments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY uq_transport_student_route (route_id, student_id),
  INDEX idx_transport_assignments_status (status)
) ENGINE=InnoDB;

CREATE TABLE messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  channel ENUM('Email','SMS','Portal','Push') NOT NULL,
  audience ENUM('All','Students','Parents','Teachers','Staff') NOT NULL,
  status ENUM('Draft','Scheduled','Sent') NOT NULL DEFAULT 'Draft',
  created_by INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_messages_status_channel (status, channel)
) ENGINE=InnoDB;

CREATE TABLE saved_reports (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  report_type ENUM('Attendance','Student','Teacher','Finance','Library','Hostel','Transport','Exam') NOT NULL,
  parameters_json JSON NULL,
  created_by INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_saved_reports_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_saved_reports_type (report_type)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  action VARCHAR(120) NOT NULL,
  entity VARCHAR(120) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(80) NULL,
  metadata_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_entity (entity, entity_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

INSERT INTO roles (role_key, name, description) VALUES
('administrator', 'Administrator', 'Full platform administrator'),
('teacher', 'Teacher', 'Teacher portal and academic access'),
('lecturer', 'Lecturer', 'University lecturer portal and academic access'),
('student', 'Student', 'Student self-service portal'),
('parent', 'Parent', 'Parent and guardian portal'),
('hr', 'HR', 'Human resources officer'),
('accountant', 'Accountant', 'Finance and payroll officer'),
('registrar', 'Registrar', 'Admissions and student records officer'),
('dean', 'Dean', 'Faculty dean academic oversight'),
('hod', 'Head of Department', 'Department academic leadership'),
('librarian', 'Librarian', 'Library operations officer');

INSERT INTO permissions (permission_key, name) VALUES
('system.manage', 'Manage entire system'),
('dashboard.view', 'View dashboard'),
('admissions.manage', 'Manage admissions'),
('students.manage', 'Manage students'),
('parents.manage', 'Manage parents'),
('teachers.manage', 'Manage teachers'),
('academic.manage', 'Manage academics'),
('attendance.manage', 'Manage attendance'),
('exams.manage', 'Manage examinations and results'),
('finance.manage', 'Manage finance'),
('payroll.manage', 'Manage payroll'),
('hr.manage', 'Manage human resources'),
('library.manage', 'Manage library'),
('hostel.manage', 'Manage hostel'),
('transport.manage', 'Manage transport'),
('communication.manage', 'Manage communication'),
('reports.view', 'View reports'),
('settings.manage', 'Manage settings');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.role_key = 'administrator';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','students.manage','academic.manage','attendance.manage','exams.manage','communication.manage','reports.view')
WHERE r.role_key = 'teacher';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','students.manage','academic.manage','attendance.manage','exams.manage','communication.manage','reports.view')
WHERE r.role_key = 'lecturer';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','academic.manage','attendance.manage','exams.manage','communication.manage','reports.view')
WHERE r.role_key IN ('student','parent');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','hr.manage','payroll.manage','reports.view')
WHERE r.role_key = 'hr';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','finance.manage','payroll.manage','reports.view')
WHERE r.role_key = 'accountant';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','admissions.manage','students.manage','parents.manage','reports.view')
WHERE r.role_key = 'registrar';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','students.manage','teachers.manage','academic.manage','exams.manage','reports.view')
WHERE r.role_key = 'dean';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','teachers.manage','academic.manage','attendance.manage','exams.manage','communication.manage','reports.view')
WHERE r.role_key = 'hod';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.permission_key IN
('dashboard.view','library.manage','reports.view')
WHERE r.role_key = 'librarian';

INSERT INTO users (role_id, full_name, email, password_hash, institution_type, portal_key, status)
SELECT id, 'System Administrator', 'admin@school.local',
'pbkdf2_sha256$enterprise_school_seed_salt_2026$9b1276bcbc1d29e6adf416bf787fd44263c89a4a28c31fc3b72eb47bb0c9cc23',
'global',
'administrator',
'Active'
FROM roles WHERE role_key = 'administrator';

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
JOIN roles r ON r.role_key = seed.role_key;

INSERT INTO school_settings (setting_key, setting_value) VALUES
('school_name', 'Enterprise School'),
('school_logo', '../assets/images/logo.svg'),
('favicon', ''),
('brand_color', '#f97316'),
('portal_accent', 'Warm Orange'),
('login_background', ''),
('letterhead', ''),
('official_stamp', ''),
('principal_signature', ''),
('current_academic_year', ''),
('timezone', 'Africa/Nairobi'),
('currency', 'KES');

-- Extended operational modules used by the current application UI.
CREATE TABLE IF NOT EXISTS school_announcements (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  category ENUM('General','Event','Academic','Finance','Emergency','Sports') NOT NULL DEFAULT 'General',
  audience ENUM('All','Students','Parents','Teachers','Staff') NOT NULL DEFAULT 'All',
  publish_on DATE NOT NULL,
  status ENUM('Draft','Scheduled','Published','Archived') NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_announcements_status_date (status, publish_on),
  INDEX idx_announcements_audience (audience)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sms_reports (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  campaign_name VARCHAR(180) NOT NULL,
  provider VARCHAR(120) NOT NULL,
  recipient_count INT UNSIGNED NOT NULL DEFAULT 0,
  sent_count INT UNSIGNED NOT NULL DEFAULT 0,
  failed_count INT UNSIGNED NOT NULL DEFAULT 0,
  credits_used DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('Queued','Sent','Partially Failed','Failed') NOT NULL DEFAULT 'Queued',
  sent_at DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (sent_count + failed_count <= recipient_count),
  INDEX idx_sms_reports_status (status),
  INDEX idx_sms_reports_provider (provider)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS canteen_orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(80) NOT NULL UNIQUE,
  customer_name VARCHAR(180) NOT NULL,
  customer_type ENUM('Student','Staff','Guest') NOT NULL DEFAULT 'Student',
  item_name VARCHAR(180) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_status ENUM('Pending','Paid','Refunded') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (quantity > 0),
  CHECK (unit_price >= 0 AND total_amount >= 0),
  INDEX idx_canteen_payment_status (payment_status),
  INDEX idx_canteen_customer (customer_name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fee_receipts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  receipt_no VARCHAR(80) NOT NULL UNIQUE,
  student_id INT UNSIGNED NULL,
  student_name VARCHAR(180) NOT NULL,
  amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method ENUM('Cash','Bank','Mobile Money','Card','Cheque') NOT NULL,
  issued_on DATE NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (amount_paid >= 0),
  CONSTRAINT fk_fee_receipts_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  INDEX idx_fee_receipts_student (student_id),
  INDEX idx_fee_receipts_issued (issued_on)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expenses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  expense_no VARCHAR(80) NOT NULL UNIQUE,
  category VARCHAR(120) NOT NULL,
  vendor VARCHAR(180) NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  expense_date DATE NOT NULL,
  status ENUM('Draft','Submitted','Approved','Paid','Rejected') NOT NULL DEFAULT 'Draft',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (amount >= 0),
  INDEX idx_expenses_category (category),
  INDEX idx_expenses_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS scholarships (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  award_name VARCHAR(180) NOT NULL,
  student_id INT UNSIGNED NULL,
  student_name VARCHAR(180) NOT NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  academic_year VARCHAR(40) NOT NULL,
  status ENUM('Applied','Approved','Awarded','Revoked') NOT NULL DEFAULT 'Applied',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (amount >= 0),
  CONSTRAINT fk_scholarships_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  INDEX idx_scholarships_year_status (academic_year, status),
  INDEX idx_scholarships_student (student_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_profiles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  school_name VARCHAR(180) NOT NULL,
  institution_type ENUM('Secondary School','University') NOT NULL,
  school_email VARCHAR(190) NOT NULL,
  phone_number VARCHAR(60) NULL,
  address TEXT NULL,
  city VARCHAR(120) NULL,
  country VARCHAR(120) NULL,
  brand_color VARCHAR(40) NULL,
  status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_school_profiles_type_status (institution_type, status)
) ENGINE=InnoDB;

INSERT INTO school_announcements (title, body, category, audience, publish_on, status)
VALUES
('Sports competition', 'This is to inform the school community about the upcoming sports competition.', 'Sports', 'All', CURDATE(), 'Published')
ON DUPLICATE KEY UPDATE title = title;

INSERT INTO sms_reports (campaign_name, provider, recipient_count, sent_count, failed_count, credits_used, status, sent_at)
VALUES
('Fee reminder broadcast', 'SMS Gateway', 125, 123, 2, 125.00, 'Partially Failed', CURDATE())
ON DUPLICATE KEY UPDATE campaign_name = campaign_name;

INSERT INTO canteen_orders (order_no, customer_name, customer_type, item_name, quantity, unit_price, total_amount, payment_status)
VALUES
('CNT-0001', 'Kwame Johnson', 'Student', 'Tea with Bread', 2, 20.00, 40.00, 'Paid')
ON DUPLICATE KEY UPDATE order_no = order_no;

INSERT INTO fee_receipts (receipt_no, student_name, amount_paid, payment_method, issued_on, notes)
VALUES
('RCT-0001', 'Adjoa Kwarteng', 500.00, 'Mobile Money', CURDATE(), 'Generated branded fee receipt.')
ON DUPLICATE KEY UPDATE receipt_no = receipt_no;

INSERT INTO expenses (expense_no, category, vendor, amount, expense_date, status, notes)
VALUES
('EXP-0001', 'Utilities', 'Power Company', 2500.00, CURDATE(), 'Approved', 'Monthly electricity expense.')
ON DUPLICATE KEY UPDATE expense_no = expense_no;

INSERT INTO scholarships (award_name, student_name, amount, academic_year, status, notes)
VALUES
('Merit Scholarship', 'Nana Appiah', 15000.00, '2026', 'Awarded', 'Academic performance award.')
ON DUPLICATE KEY UPDATE award_name = award_name;

INSERT INTO school_profiles (school_name, institution_type, school_email, phone_number, address, city, country, brand_color, status)
VALUES
('CampusSphere Demonstration School', 'Secondary School', 'admin@campus.local', '+233 24 123 4567', 'P.O. Box 5566, Campus Street', 'Accra', 'Ghana', '#f97316', 'Active');
