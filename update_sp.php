<?php
require 'config/database.php';

$conn->query("DROP PROCEDURE IF EXISTS ApplyLeave;");
$q = "CREATE PROCEDURE ApplyLeave(IN p_emp_id INT, IN p_leave_type VARCHAR(20), IN p_start_date DATE, IN p_end_date DATE, IN p_reason TEXT)
BEGIN
    INSERT INTO `leaves` (`emp_id`, `leave_type`, `start_date`, `end_date`, `reason`, `status`) 
    VALUES (p_emp_id, p_leave_type, p_start_date, p_end_date, p_reason, 'Pending');
END;";
if($conn->query($q)) {
    echo "ApplyLeave SP updated.";
} else {
    echo "Error: " . $conn->error;
}
?>
