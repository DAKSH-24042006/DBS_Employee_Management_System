<?php
// api/markAttendance.php
require_once 'db_connection.php';

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
$emp_id = $input['emp_id'] ?? null;
$action = $input['action'] ?? null; // 'check_in' or 'check_out'

if (!$emp_id || !$action) {
    jsonResponse(false, "Missing required parameters.");
}

$date = date('Y-m-d');
$time = date('H:i:s');

if ($action === 'check_in') {
    // Check if already checked in for today
    $checkSql = "SELECT * FROM attendance WHERE emp_id = $emp_id AND date = '$date'";
    $checkRes = $conn->query($checkSql);
    
    if ($checkRes->num_rows > 0) {
        jsonResponse(false, "You have already checked in for today.");
    }
    
    // Determine status (Late if after 09:30:00)
    $status = (strtotime($time) > strtotime('09:30:00')) ? 'Late' : 'Present';
    
    $sql = "INSERT INTO attendance (emp_id, date, check_in_time, status) VALUES ($emp_id, '$date', '$time', '$status')";
    if ($conn->query($sql)) {
        jsonResponse(true, "Check-in successful at $time.", ['status' => $status, 'time' => $time]);
    } else {
        jsonResponse(false, "Check-in failed: " . $conn->error);
    }
} elseif ($action === 'check_out') {
    // Check if user has checked in today and not yet checked out
    $checkSql = "SELECT * FROM attendance WHERE emp_id = $emp_id AND date = '$date' AND check_out_time IS NULL";
    $checkRes = $conn->query($checkSql);
    
    if ($checkRes->num_rows === 0) {
        jsonResponse(false, "No active check-in found for today or you have already checked out.");
    }
    
    $sql = "UPDATE attendance SET check_out_time = '$time' WHERE emp_id = $emp_id AND date = '$date'";
    if ($conn->query($sql)) {
        jsonResponse(true, "Check-out successful at $time.", ['time' => $time]);
    } else {
        jsonResponse(false, "Check-out failed: " . $conn->error);
    }
} else {
    jsonResponse(false, "Invalid action.");
}
?>
