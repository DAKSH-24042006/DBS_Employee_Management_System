<?php
// api/getEmployees.php
require_once 'db_connection.php';

// Auth Check: Admin or Manager only
if (!isset($_SESSION['role']) || ($_SESSION['role'] !== 'Admin' && $_SESSION['role'] !== 'Manager')) {
    jsonResponse(false, "Unauthorized access.");
}

$search = isset($_GET['search']) ? sanitizeInput($conn, $_GET['search']) : '';
$dept = isset($_GET['department']) ? sanitizeInput($conn, $_GET['department']) : '';

$sql = "SELECT e.*, u.username, u.role FROM employees e JOIN users u ON e.emp_id = u.user_id";
$where = [];

if ($search) {
    $where[] = "(e.name LIKE '%$search%' OR e.department LIKE '%$search%' OR e.designation LIKE '%$search%')";
}

if ($dept) {
    $where[] = "e.department = '$dept'";
}

if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

$sql .= " ORDER BY e.name ASC";

$result = $conn->query($sql);
$employees = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Remove password for security if it was accidentally selected
        unset($row['password']);
        $employees[] = $row;
    }
    jsonResponse(true, "Employees retrieved successfully.", $employees);
} else {
    jsonResponse(false, "Database error: " . $conn->error);
}
?>
