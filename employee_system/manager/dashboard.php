<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Manager');

$manager_id = $_SESSION['user_id'];
$dept_query = $conn->query("SELECT department FROM employees WHERE emp_id = $manager_id")->fetch_assoc();
$manager_dept = $dept_query['department'] ?? '';

// Get counts for department
$total_emps = $conn->query("SELECT COUNT(*) as count FROM employees WHERE department = '$manager_dept'")->fetch_assoc()['count'];
$pending_leaves = $conn->query("SELECT COUNT(*) as count FROM leaves l JOIN employees e ON l.emp_id = e.emp_id WHERE l.status = 'Pending' AND e.department = '$manager_dept'")->fetch_assoc()['count'];
$today = date('Y-m-d');
$present_today = $conn->query("SELECT COUNT(*) as count FROM attendance a JOIN employees e ON a.emp_id = e.emp_id WHERE a.date = '$today' AND e.department = '$manager_dept'")->fetch_assoc()['count'];

require_once '../includes/header.php';
?>
<h2 style="margin-bottom: 0.5rem;">Manager Dashboard</h2>
<p style="color: #a7a7a7; margin-bottom: 2rem;">Welcome, <?= htmlspecialchars($_SESSION['username']) ?>! Overview for Department: <strong><?= htmlspecialchars($manager_dept) ?></strong></p>

<div class="cardcontainer">
    <div class="card">
        <p class="cardtitle">Dept Employees</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0;"><?= $total_emps ?></h1>
        <p class="cardinfo">Total Staff</p>
    </div>
    <div class="card" onclick="location.href='leave_approvals.php'">
        <p class="cardtitle">Pending Leaves</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0; color: #1bd760;"><?= $pending_leaves ?></h1>
        <p class="cardinfo">Review Requests</p>
    </div>
    <div class="card" onclick="location.href='attendance.php'">
        <p class="cardtitle">Present Today</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0;"><?= $present_today ?></h1>
        <p class="cardinfo">Dept Attendance</p>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>
