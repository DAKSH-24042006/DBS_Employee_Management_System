<?php
// api/deleteEmployee.php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['emp_id'])) {
    jsonResponse(false, "Employee ID is required.");
}

$emp_id = $data['emp_id'];

$stmt = $conn->prepare("CALL DeleteEmployee(?)");
$stmt->bind_param("i", $emp_id);

if ($stmt->execute()) {
    jsonResponse(true, "Employee deleted successfully.");
} else {
    jsonResponse(false, "Error: " . $stmt->error);
}
?>
