USE school_management;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS institution_type ENUM('global','secondary','university') NOT NULL DEFAULT 'global' AFTER password_hash,
  ADD COLUMN IF NOT EXISTS portal_key VARCHAR(80) NOT NULL DEFAULT 'global' AFTER institution_type,
  ADD INDEX IF NOT EXISTS idx_users_institution_portal (institution_type, portal_key);

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
  password_hash = VALUES(password_hash),
  institution_type = VALUES(institution_type),
  portal_key = VALUES(portal_key),
  status = VALUES(status),
  role_id = VALUES(role_id);
