<?php
// api/getLeaveBalance.php
require_once 'db_connection.php';

$emp_id = $_GET['emp_id'] ?? ($_SESSION['user_id'] ?? null);

if (!$emp_id) {
    jsonResponse(false, "Authentication required.");
}

$stmt = $conn->prepare("SELECT * FROM leave_balances WHERE emp_id = ?");
$stmt->bind_param("i", $emp_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    jsonResponse(true, "Leave balance retrieved.", $row);
} else {
    // If not found, it might be a new user not yet initialized. 
    // Triggers should handle this, but as a fallback:
    jsonResponse(true, "Leave balance initialized to defaults.", [
        'emp_id' => $emp_id,
        'casual_leaves' => 15,
        'sick_leaves' => 10,
        'earned_leaves' => 12
    ]);
}
?>
