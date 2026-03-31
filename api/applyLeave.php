<?php
// api/applyLeave.php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);
$emp_id = $data['emp_id'] ?? ($_SESSION['user_id'] ?? null);

if (!$emp_id) {
    jsonResponse(false, "Authentication required.");
}

$start_date = $data['start_date'] ?? date('Y-m-d');
$end_date = $data['end_date'] ?? $start_date;
$leave_type = $data['leave_type'] ?? 'Casual';
$reason = $data['reason'] ?? 'Leave applied via system';

// ✅ Updated stored procedure call with 5 parameters
$stmt = $conn->prepare("CALL ApplyLeave_v2(?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $emp_id, $start_date, $end_date, $leave_type, $reason);

if ($stmt->execute()) {
    jsonResponse(true, "Leave application submitted successfully.");
} else {
    jsonResponse(false, "Error: " . $stmt->error);
}
?>
