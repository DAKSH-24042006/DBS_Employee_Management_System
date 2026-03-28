USE employee_management;
DELIMITER //

CREATE TRIGGER AfterLeaveUpdate
AFTER UPDATE ON `leaves`
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO `audit_log` (`table_name`, `action`, `record_id`, `old_value`, `new_value`, `changed_by`)
        VALUES ('leaves', 'UPDATE_STATUS', NEW.leave_id, OLD.status, NEW.status, 'SYSTEM');
    END IF;
END //

CREATE TRIGGER BeforeAttendanceInsert
BEFORE INSERT ON `attendance`
FOR EACH ROW
BEGIN
    IF NEW.date > CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot mark attendance for a future date';
    END IF;
END //

DELIMITER ;
