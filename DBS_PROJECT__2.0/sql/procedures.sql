USE employee_management;
DELIMITER //

CREATE PROCEDURE AddEmployee(
    IN p_username VARCHAR(50), IN p_password VARCHAR(255), IN p_role ENUM('Admin', 'Manager', 'Employee'),
    IN p_name VARCHAR(100), IN p_department VARCHAR(50), IN p_designation VARCHAR(50),
    IN p_contact VARCHAR(100), IN p_join_date DATE
)
BEGIN
    DECLARE v_user_id INT;
    INSERT INTO `users` (`username`, `password`, `role`) VALUES (p_username, p_password, p_role);
    SET v_user_id = LAST_INSERT_ID();
    INSERT INTO `employees` (`emp_id`, `name`, `department`, `designation`, `contact_details`, `date_of_joining`) 
    VALUES (v_user_id, p_name, p_department, p_designation, p_contact, p_join_date);
END //

CREATE PROCEDURE MarkAttendance(IN p_emp_id INT, IN p_date DATE, IN p_check_in TIME, IN p_status ENUM('Present', 'Absent', 'Half Day', 'Late'))
BEGIN
    INSERT INTO `attendance` (`emp_id`, `date`, `check_in_time`, `status`) 
    VALUES (p_emp_id, p_date, p_check_in, p_status)
    ON DUPLICATE KEY UPDATE `status` = p_status;
END //

CREATE PROCEDURE ProcessLeave(IN p_leave_id INT, IN p_status ENUM('Approved', 'Rejected'), IN p_approved_by INT, IN p_remarks TEXT)
BEGIN
    UPDATE `leaves` SET `status` = p_status WHERE `leave_id` = p_leave_id;
    INSERT INTO `leave_approvals` (`leave_id`, `approval_status`, `approved_by`, `remarks`) 
    VALUES (p_leave_id, p_status, p_approved_by, p_remarks);
END //

DELIMITER ;
