<?php
// api/getAttendance.php
require_once 'db_connection.php';

$emp_id = $_GET['emp_id'] ?? ($_SESSION['user_id'] ?? null);
$role = $_GET['role'] ?? ($_SESSION['role'] ?? null);

if (!$emp_id) {
    jsonResponse(false, "Authentication required.");
}

// Admins/Managers can fetch for anyone, Employees only for themselves
// (For simplicity in this core PHP project, we'll assume the frontend sends the correct emp_id)

$sql = "SELECT a.*, e.name, e.department,
        TIME_FORMAT(TIMEDIFF(a.check_out_time, a.check_in_time), '%H:%i') as duration
        FROM attendance a
        JOIN employees e ON a.emp_id = e.emp_id
        WHERE a.emp_id = $emp_id
        ORDER BY a.date DESC";

$result = $conn->query($sql);
$attendance = [];
while ($row = $result->fetch_assoc()) {
    $attendance[] = $row;
}

jsonResponse(true, "Attendance records retrieved.", $attendance);
?>
