<?php
// api/addEmployee.php
require_once 'db_connection.php';

// Auth Check: Admin only for adding employees
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'Admin') {
    jsonResponse(false, "Unauthorized access. Only Admins can add employees.");
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    jsonResponse(false, "Invalid input data.");
}

$name = sanitizeInput($conn, $data['name'] ?? '');
$email = sanitizeInput($conn, $data['email'] ?? '');
$designation = sanitizeInput($conn, $data['designation'] ?? '');
$username = sanitizeInput($conn, $data['username'] ?? '');
$password = password_hash($data['password'] ?? 'Employee@123', PASSWORD_DEFAULT);
$role = sanitizeInput($conn, $data['role'] ?? 'Employee');
$department = sanitizeInput($conn, $data['department'] ?? '');
$joining_date = sanitizeInput($conn, $data['joining_date'] ?? date('Y-m-d'));

// Check for existing username
$check_stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$check_stmt->bind_param("s", $username);
$check_stmt->execute();
if ($check_stmt->get_result()->num_rows > 0) {
    jsonResponse(false, "Username already exists.");
}

// Call stored procedure
$stmt_emp = $conn->prepare("CALL AddEmployee(?, ?, ?, ?, ?, ?, ?, ?)");
$stmt_emp->bind_param("ssssssss", $name, $email, $designation, $username, $password, $role, $department, $joining_date);

if ($stmt_emp->execute()) {
    jsonResponse(true, "Employee added successfully.");
} else {
    jsonResponse(false, "Error adding employee: " . $stmt_emp->error);
}
?>
