<?php
// api/approveLeave.php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);
$leave_id = intval($data['leave_id']);
$status = $data['status']; // 'Approved' or 'Rejected'

if (!$leave_id || !$status) {
    jsonResponse(false, "Invalid parameters.");
}

$stmt = $conn->prepare("CALL UpdateLeaveStatus(?, ?)");
$stmt->bind_param("is", $leave_id, $status);

if ($stmt->execute()) {
    jsonResponse(true, "Leave status updated successfully.");
} else {
    jsonResponse(false, "Error: " . $stmt->error);
}
?>
