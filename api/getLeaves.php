<?php
// api/getLeaves.php
require_once 'db_connection.php';

$user_id = $_GET['user_id'] ?? ($_SESSION['user_id'] ?? null);
$role = $_GET['role'] ?? ($_SESSION['role'] ?? null);

if (!$user_id) {
    jsonResponse(false, "Authentication required.");
}

if ($role === 'Admin' || $role === 'Manager') {
    // Managers see all leaves for their department, Admins see all.
    // Simplifying: Return all for now, or filter by status if requested.
    $status_filter = isset($_GET['status']) ? sanitizeInput($conn, $_GET['status']) : null;
    $sql = "SELECT l.*, e.name FROM leaves l JOIN employees e ON l.emp_id = e.emp_id";
    if ($status_filter) $sql .= " WHERE l.status = '$status_filter'";
    $sql .= " ORDER BY l.application_date DESC";
} else {
    // Employee sees only their own leaves
    $sql = "SELECT * FROM leaves WHERE emp_id = $user_id ORDER BY application_date DESC";
}

$result = $conn->query($sql);
$leaves = [];
while ($row = $result->fetch_assoc()) {
    $leaves[] = $row;
}

jsonResponse(true, "Leaves retrieved.", $leaves);
?>
