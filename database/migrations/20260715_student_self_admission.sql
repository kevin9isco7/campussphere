-- Student self-service admission workflow.
-- Safe to run after the base schema; this preserves existing admissions data.

DELIMITER $$

DROP PROCEDURE IF EXISTS add_admission_column $$
CREATE PROCEDURE add_admission_column(IN column_name VARCHAR(64), IN column_definition TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'admissions'
      AND COLUMN_NAME = column_name
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE admissions ADD COLUMN ', column_name, ' ', column_definition);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END $$

DROP PROCEDURE IF EXISTS add_admission_index $$
CREATE PROCEDURE add_admission_index(IN index_name VARCHAR(64), IN index_definition TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'admissions'
      AND INDEX_NAME = index_name
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE admissions ADD INDEX ', index_name, ' ', index_definition);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END $$

DROP PROCEDURE IF EXISTS add_admission_constraint $$
CREATE PROCEDURE add_admission_constraint(IN constraint_name VARCHAR(64), IN constraint_definition TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'admissions'
      AND CONSTRAINT_NAME = constraint_name
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE admissions ADD CONSTRAINT ', constraint_name, ' ', constraint_definition);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END $$

DELIMITER ;

CALL add_admission_column('user_id', 'INT UNSIGNED NULL AFTER id');
CALL add_admission_column('institution_type', "ENUM('secondary','university') NOT NULL DEFAULT 'secondary' AFTER user_id");
CALL add_admission_column('payment_status', "ENUM('Not Paid','Paid','Waived') NOT NULL DEFAULT 'Not Paid' AFTER status");
CALL add_admission_column('registration_fee_amount', 'DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER payment_status');
CALL add_admission_column('registration_fee_reference', 'VARCHAR(120) NULL AFTER registration_fee_amount');
CALL add_admission_column('registration_fee_paid_at', 'DATETIME NULL AFTER registration_fee_reference');
CALL add_admission_column('submitted_at', 'DATETIME NULL AFTER registration_fee_paid_at');
CALL add_admission_column('verified_at', 'DATETIME NULL AFTER submitted_at');
CALL add_admission_column('verification_notes', 'TEXT NULL AFTER verified_at');

ALTER TABLE admissions
  MODIFY status ENUM('Draft','Payment Pending','Submitted','Reviewed','Under Review','Documents Verified','Accepted','Admitted','Rejected','Enrolled')
  NOT NULL DEFAULT 'Draft';

CALL add_admission_index('idx_admissions_user', '(user_id)');
CALL add_admission_index('idx_admissions_institution_status', '(institution_type, status)');
CALL add_admission_index('idx_admissions_payment_status', '(payment_status)');
CALL add_admission_constraint('fk_admissions_user', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL');

CREATE TABLE IF NOT EXISTS admission_documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admission_id INT UNSIGNED NOT NULL,
  document_type ENUM('Birth Certificate','Previous Report','Passport Photo','National ID','Transcript','Recommendation','Other') NOT NULL DEFAULT 'Other',
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  mime_type VARCHAR(120) NULL,
  status ENUM('Uploaded','Verified','Rejected') NOT NULL DEFAULT 'Uploaded',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_admission_documents_admission FOREIGN KEY (admission_id) REFERENCES admissions(id) ON DELETE CASCADE,
  INDEX idx_admission_documents_admission (admission_id),
  INDEX idx_admission_documents_status (status)
) ENGINE=InnoDB;

DROP PROCEDURE IF EXISTS add_admission_column;
DROP PROCEDURE IF EXISTS add_admission_index;
DROP PROCEDURE IF EXISTS add_admission_constraint;
