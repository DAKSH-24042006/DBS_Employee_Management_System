<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');

if (isset($_GET['id'])) {
    $emp_id = intval($_GET['id']);
    // Due to ON DELETE CASCADE on employees, deleting the user will delete the employee, attendance, leaves
    $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $emp_id);
    $stmt->execute();
}
header('Location: employees.php');
exit();
?>
