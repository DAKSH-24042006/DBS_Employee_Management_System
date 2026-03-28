USE employee_management;

-- -----------------------------------------------------------------------------
-- 1. STORED PROCEDURES
-- -----------------------------------------------------------------------------

DELIMITER //

-- AddEmployee(name, email, position) 
-- Includes basic generation for users to satisfy schema constraints
DROP PROCEDURE IF EXISTS AddEmployee //
CREATE PROCEDURE AddEmployee(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_position VARCHAR(50),
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_role ENUM('Admin', 'Manager', 'Employee'),
    IN p_department VARCHAR(50),
    IN p_date_of_joining DATE
)
BEGIN
    DECLARE v_user_id INT;

    -- Insert into users table
    INSERT INTO `users` (`username`, `password`, `role`) 
    VALUES (p_username, p_password, p_role);
    
    SET v_user_id = LAST_INSERT_ID();

    -- Insert into employees table
    INSERT INTO `employees` (`emp_id`, `name`, `department`, `designation`, `contact_details`, `date_of_joining`) 
    VALUES (v_user_id, p_name, p_department, p_position, p_email, p_date_of_joining);
    
END //

-- GetEmployee(emp_id)
DROP PROCEDURE IF EXISTS GetEmployee //
CREATE PROCEDURE GetEmployee(IN p_emp_id INT)
BEGIN
    SELECT 
        e.emp_id, 
        e.name, 
        e.department, 
        e.designation, 
        e.contact_details, 
        e.date_of_joining,
        u.username,
        u.role
    FROM `employees` e
    JOIN `users` u ON e.emp_id = u.user_id
    WHERE e.emp_id = p_emp_id;
END //

-- MarkAttendance(emp_id, date, status)
DROP PROCEDURE IF EXISTS MarkAttendance //
CREATE PROCEDURE MarkAttendance(
    IN p_emp_id INT,
    IN p_date DATE,
    IN p_check_in_time TIME,
    IN p_status VARCHAR(20)
)
BEGIN
    -- Prevent duplicate attendance using IF EXISTS logic
    IF EXISTS (SELECT 1 FROM `attendance` WHERE `emp_id` = p_emp_id AND `date` = p_date) THEN
        -- Optionally update or just ignore. We'll raise a warning or just do nothing.
        -- We will select a message to let PHP know it's a duplicate.
        SELECT 'Duplicate attendance entry for today.' AS message;
    ELSE
        INSERT INTO `attendance` (`emp_id`, `date`, `check_in_time`, `status`) 
        VALUES (p_emp_id, p_date, p_check_in_time, p_status);
        SELECT 'Attendance marked successfully.' AS message;
    END IF;
END //

-- ApplyLeave(emp_id, start_date, end_date, reason)
DROP PROCEDURE IF EXISTS ApplyLeave //
CREATE PROCEDURE ApplyLeave(
    IN p_emp_id INT,
    IN p_leave_type VARCHAR(50),
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_reason TEXT
)
BEGIN
    -- Default status = 'Pending' implicitly or explicitly
    INSERT INTO `leaves` (`emp_id`, `leave_type`, `start_date`, `end_date`, `reason`, `status`) 
    VALUES (p_emp_id, p_leave_type, p_start_date, p_end_date, p_reason, 'Pending');
END //

-- ApproveLeave(leave_id)
DROP PROCEDURE IF EXISTS ApproveLeave //
CREATE PROCEDURE ApproveLeave(
    IN p_leave_id INT,
    IN p_approved_by INT,
    IN p_remarks TEXT
)
BEGIN
    -- Update leaves table
    UPDATE `leaves` SET `status` = 'Approved' WHERE `leave_id` = p_leave_id;
    
    -- Insert into leave_approvals
    INSERT INTO `leave_approvals` (`leave_id`, `approval_status`, `approved_by`, `remarks`) 
    VALUES (p_leave_id, 'Approved', p_approved_by, p_remarks);
END //

-- RejectLeave(leave_id)
DROP PROCEDURE IF EXISTS RejectLeave //
CREATE PROCEDURE RejectLeave(
    IN p_leave_id INT,
    IN p_approved_by INT,
    IN p_remarks TEXT
)
BEGIN
    -- Update leaves table
    UPDATE `leaves` SET `status` = 'Rejected' WHERE `leave_id` = p_leave_id;
    
    -- Insert into leave_approvals
    INSERT INTO `leave_approvals` (`leave_id`, `approval_status`, `approved_by`, `remarks`) 
    VALUES (p_leave_id, 'Rejected', p_approved_by, p_remarks);
END //

-- -----------------------------------------------------------------------------
-- 2. MYSQL FUNCTIONS
-- -----------------------------------------------------------------------------

-- attendance_percentage(emp_id)
DROP FUNCTION IF EXISTS attendance_percentage //
CREATE FUNCTION attendance_percentage(p_emp_id INT) 
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE v_total_days INT;
    DECLARE v_present_days INT;
    DECLARE v_percentage DECIMAL(5,2);

    SELECT COUNT(*) INTO v_total_days FROM `attendance` WHERE `emp_id` = p_emp_id;
    SELECT COUNT(*) INTO v_present_days FROM `attendance` WHERE `emp_id` = p_emp_id AND `status` IN ('Present', 'Late', 'Half Day');

    IF v_total_days = 0 THEN
        RETURN 0.00;
    ELSE
        SET v_percentage = (v_present_days / v_total_days) * 100;
        RETURN ROUND(v_percentage, 2);
    END IF;
END //

-- total_leaves(emp_id)
DROP FUNCTION IF EXISTS total_leaves //
CREATE FUNCTION total_leaves(p_emp_id INT) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_total_leaves INT;
    
    SELECT COUNT(*) INTO v_total_leaves 
    FROM `leaves` 
    WHERE `emp_id` = p_emp_id AND `status` = 'Approved';
    
    RETURN COALESCE(v_total_leaves, 0);
END //

DELIMITER ;

-- -----------------------------------------------------------------------------
-- 3. VIEWS
-- -----------------------------------------------------------------------------

-- employee_summary
CREATE OR REPLACE VIEW employee_summary AS
SELECT 
    e.emp_id,
    e.name,
    e.department,
    e.designation,
    e.contact_details,
    e.date_of_joining,
    attendance_percentage(e.emp_id) AS attendance_pct,
    total_leaves(e.emp_id) AS leaves_taken
FROM `employees` e;

-- today_attendance
CREATE OR REPLACE VIEW today_attendance AS
SELECT 
    e.emp_id,
    e.name,
    e.department,
    e.designation,
    COALESCE(a.status, 'Not Marked') AS attendance_status,
    a.check_in_time,
    a.check_out_time
FROM `employees` e
LEFT JOIN `attendance` a ON e.emp_id = a.emp_id AND a.date = CURDATE();
