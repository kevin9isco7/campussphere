USE school_management;

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
