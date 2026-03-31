USE employee_db;

-- ---------------------------------------------------------
-- 0. Update Leave Type Enum
-- ---------------------------------------------------------
ALTER TABLE `leaves` MODIFY COLUMN `leave_type` ENUM('Casual', 'Sick', 'Earned', 'Other') DEFAULT 'Casual';

-- ---------------------------------------------------------
-- 1. Create Audit Log Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_log` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `action` VARCHAR(255) NOT NULL,
    `emp_id` INT NOT NULL,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`emp_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- 2. Add Stored Procedures
-- ---------------------------------------------------------
DELIMITER //

-- Simplified AddEmployee v2
DROP PROCEDURE IF EXISTS AddEmployee_v2 //
CREATE PROCEDURE AddEmployee_v2(
    IN p_name VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_username VARCHAR(50);
    SET v_username = LOWER(REPLACE(p_name, ' ', '.'));
    
    INSERT INTO `users` (`username`, `password`, `role`) 
    VALUES (v_username, p_password, 'Employee');
    
    SET v_user_id = LAST_INSERT_ID();
    
    INSERT INTO `employees` (`emp_id`, `name`, `department`, `designation`, `contact_details`, `date_of_joining`) 
    VALUES (v_user_id, p_name, 'General', 'Staff', CONCAT(v_username, '@example.com'), CURDATE());
    
    SELECT v_user_id AS new_emp_id;
END //

-- Updated ApplyLeave_v2 to accept all required fields
DROP PROCEDURE IF EXISTS ApplyLeave_v2 //
CREATE PROCEDURE ApplyLeave_v2(
    IN p_emp_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_leave_type ENUM('Casual', 'Sick', 'Earned', 'Other'),
    IN p_reason TEXT
)
BEGIN
    INSERT INTO `leaves` (`emp_id`, `leave_type`, `start_date`, `end_date`, `reason`, `status`) 
    VALUES (p_emp_id, p_leave_type, p_start_date, p_end_date, p_reason, 'Pending');
END //

-- UpdateLeaveStatus(leave_id, status)
DROP PROCEDURE IF EXISTS UpdateLeaveStatus //
CREATE PROCEDURE UpdateLeaveStatus(
    IN p_leave_id INT,
    IN p_status ENUM('Pending', 'Approved', 'Rejected')
)
BEGIN
    UPDATE `leaves` SET `status` = p_status WHERE `leave_id` = p_leave_id;
END //

-- UpdateEmployee(emp_id, name, department, designation, contact_details, role)
DROP PROCEDURE IF EXISTS UpdateEmployee //
CREATE PROCEDURE UpdateEmployee(
    IN p_emp_id INT,
    IN p_name VARCHAR(100),
    IN p_department VARCHAR(50),
    IN p_designation VARCHAR(50),
    IN p_contact_details VARCHAR(255),
    IN p_role ENUM('Admin', 'Manager', 'Employee')
)
BEGIN
    UPDATE `employees` 
    SET `name` = p_name, 
        `department` = p_department, 
        `designation` = p_designation, 
        `contact_details` = p_contact_details 
    WHERE `emp_id` = p_emp_id;
    
    UPDATE `users` 
    SET `role` = p_role 
    WHERE `user_id` = p_emp_id;
END //

-- DeleteEmployee(emp_id)
DROP PROCEDURE IF EXISTS DeleteEmployee //
CREATE PROCEDURE DeleteEmployee(IN p_emp_id INT)
BEGIN
    -- Delete from users will cascade to employees and attendance/leaves
    DELETE FROM `users` WHERE `user_id` = p_emp_id;
END //

DELIMITER ;

-- ---------------------------------------------------------
-- 3. Create Triggers
-- ---------------------------------------------------------
DELIMITER //

-- BEFORE INSERT on leaves: Automatically set status = 'Pending'
DROP TRIGGER IF EXISTS trg_before_leave_insert_status //
CREATE TRIGGER trg_before_leave_insert_status
BEFORE INSERT ON `leaves`
FOR EACH ROW
BEGIN
    SET NEW.status = 'Pending';
END //

-- BEFORE INSERT on leaves: Prevent employee from applying more than 10 leaves
DROP TRIGGER IF EXISTS trg_before_leave_insert_limit //
CREATE TRIGGER trg_before_leave_insert_limit
BEFORE INSERT ON `leaves`
FOR EACH ROW
BEGIN
    DECLARE leave_count INT;
    SELECT COUNT(*) INTO leave_count FROM `leaves` WHERE `emp_id` = NEW.emp_id;
    
    IF leave_count >= 10 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Maximum leave applications (10) reached.';
    END IF;
END //

-- AFTER INSERT on leaves: Insert record into audit_log table
DROP TRIGGER IF EXISTS trg_after_leave_insert_audit //
CREATE TRIGGER trg_after_leave_insert_audit
AFTER INSERT ON `leaves`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action`, `emp_id`) 
    VALUES ('Leave Application Submitted', NEW.emp_id);
END //

-- AFTER UPDATE on leaves: Insert record into audit_log table for status changes
DROP TRIGGER IF EXISTS trg_after_leave_update_audit //
CREATE TRIGGER trg_after_leave_update_audit
AFTER UPDATE ON `leaves`
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO `audit_log` (`action`, `emp_id`) 
        VALUES (CONCAT('Leave status updated to: ', NEW.status), NEW.emp_id);
    END IF;
END //

DELIMITER ;

-- ---------------------------------------------------------
-- 4. Leave Balances and Automatic Deductions
-- ---------------------------------------------------------

-- Create leave balances table
CREATE TABLE IF NOT EXISTS `leave_balances` (
    `emp_id` INT PRIMARY KEY,
    `casual_leaves` INT DEFAULT 15,
    `sick_leaves` INT DEFAULT 10,
    `earned_leaves` INT DEFAULT 12,
    FOREIGN KEY (`emp_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Initialize balances for existing employees
INSERT IGNORE INTO `leave_balances` (emp_id) SELECT user_id FROM `users`;

-- Cleanup: Reset any existing negative balances to 0
UPDATE `leave_balances` SET `casual_leaves` = GREATEST(0, `casual_leaves`), `sick_leaves` = GREATEST(0, `sick_leaves`), `earned_leaves` = GREATEST(0, `earned_leaves`);

DELIMITER //

-- BEFORE UPDATE on leaves: Automatically Reject if balance is insufficient
DROP TRIGGER IF EXISTS trg_before_leave_update_validate //
CREATE TRIGGER trg_before_leave_update_validate
BEFORE UPDATE ON `leaves`
FOR EACH ROW
BEGIN
    DECLARE v_days INT;
    DECLARE v_available INT;
    
    -- Only check if status is changing to 'Approved'
    IF OLD.status <> 'Approved' AND NEW.status = 'Approved' THEN
        SET v_days = DATEDIFF(NEW.end_date, NEW.start_date) + 1;
        
        -- Fetch available balance
        IF NEW.leave_type = 'Casual' THEN
            SELECT `casual_leaves` INTO v_available FROM `leave_balances` WHERE `emp_id` = NEW.emp_id;
        ELSEIF NEW.leave_type = 'Sick' THEN
            SELECT `sick_leaves` INTO v_available FROM `leave_balances` WHERE `emp_id` = NEW.emp_id;
        ELSEIF NEW.leave_type = 'Earned' THEN
            SELECT `earned_leaves` INTO v_available FROM `leave_balances` WHERE `emp_id` = NEW.emp_id;
        ELSE
            -- 'Other' doesn't have a quota, always allow? Or treat as 0?
            SET v_available = 999; 
        END IF;
        
        -- If insufficient, auto-reject
        IF v_available < v_days THEN
            SET NEW.status = 'Rejected';
            -- Note: We can't update another table here, but AFTER UPDATE handles the audit log.
        END IF;
    END IF;
END //

-- AFTER INSERT on users: Automatically initialize leave balance for new employees
DROP TRIGGER IF EXISTS trg_after_user_insert_balance //
CREATE TRIGGER trg_after_user_insert_balance
AFTER INSERT ON `users`
FOR EACH ROW
BEGIN
    INSERT INTO `leave_balances` (`emp_id`) VALUES (NEW.user_id);
END //

-- AFTER UPDATE on leaves: Deduct from balance when status becomes 'Approved'
DROP TRIGGER IF EXISTS trg_after_leave_update_deduct //
CREATE TRIGGER trg_after_leave_update_deduct
AFTER UPDATE ON `leaves`
FOR EACH ROW
BEGIN
    DECLARE v_days INT;
    DECLARE v_type VARCHAR(20);
    
    -- Only act if status became 'Approved' (and was verified in BEFORE trigger)
    IF OLD.status <> 'Approved' AND NEW.status = 'Approved' THEN
        SET v_days = DATEDIFF(NEW.end_date, NEW.start_date) + 1;
        SET v_type = NEW.leave_type;
        
        IF v_type = 'Casual' THEN
            UPDATE `leave_balances` SET `casual_leaves` = `casual_leaves` - v_days WHERE `emp_id` = NEW.emp_id;
        ELSEIF v_type = 'Sick' THEN
            UPDATE `leave_balances` SET `sick_leaves` = `sick_leaves` - v_days WHERE `emp_id` = NEW.emp_id;
        ELSEIF v_type = 'Earned' THEN
            UPDATE `leave_balances` SET `earned_leaves` = `earned_leaves` - v_days WHERE `emp_id` = NEW.emp_id;
        END IF;
    END IF;
END //

DELIMITER ;

-- ---------------------------------------------------------
-- 4. Analytics Queries (For Dashboard)
-- ---------------------------------------------------------

-- Employee Leave Analytics: Total leaves per employee (descending)
-- SELECT e.name, COUNT(l.leave_id) AS total_leaves FROM employees e LEFT JOIN leaves l ON e.emp_id = l.emp_id GROUP BY e.emp_id ORDER BY total_leaves DESC;

-- Pending Leave Requests: All leaves where status = 'Pending'
-- SELECT l.*, e.name FROM leaves l JOIN employees e ON l.emp_id = e.emp_id WHERE l.status = 'Pending';

-- Top 5 Employees with Highest Leaves
-- SELECT e.name, COUNT(l.leave_id) AS leave_count FROM employees e JOIN leaves l ON e.emp_id = l.emp_id GROUP BY e.emp_id ORDER BY leave_count DESC LIMIT 5;

-- Department-wise leave count
-- SELECT department, COUNT(l.leave_id) AS leave_count FROM employees e JOIN leaves l ON e.emp_id = l.emp_id GROUP BY department;
