<?php
// api/updateEmployee.php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['emp_id'])) {
    jsonResponse(false, "Employee ID is required.");
}

$emp_id = $data['emp_id'];
$name = $data['name'] ?? '';
$department = $data['department'] ?? '';
$designation = $data['designation'] ?? '';
$contact_details = $data['contact_details'] ?? '';
$role = $data['role'] ?? 'Employee';

$stmt = $conn->prepare("CALL UpdateEmployee(?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssss", $emp_id, $name, $department, $designation, $contact_details, $role);

if ($stmt->execute()) {
    jsonResponse(true, "Employee updated successfully.");
} else {
    jsonResponse(false, "Error: " . $stmt->error);
}
?>
