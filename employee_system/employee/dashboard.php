<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Employee');

$emp_id = $_SESSION['user_id'];
$month = date('m');
$year = date('Y');

// Personal Stats
$present_days = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE emp_id = $emp_id AND MONTH(date) = '$month' AND YEAR(date) = '$year'")->fetch_assoc()['count'];
$approved_leaves = $conn->query("SELECT COUNT(*) as count FROM leaves WHERE emp_id = $emp_id AND status = 'Approved'")->fetch_assoc()['count'];
$pending_leaves = $conn->query("SELECT COUNT(*) as count FROM leaves WHERE emp_id = $emp_id AND status = 'Pending'")->fetch_assoc()['count'];

// Functions Integration
$attendance_pct = $conn->query("SELECT attendance_percentage($emp_id) as pct")->fetch_assoc()['pct'];
$total_leaves_taken = $conn->query("SELECT total_leaves($emp_id) as total")->fetch_assoc()['total'];

require_once '../includes/header.php';
?>
<h2 style="margin-bottom: 0.5rem;">Employee Dashboard</h2>
<p style="color: #a7a7a7; margin-bottom: 2rem;">Welcome, <?= htmlspecialchars($_SESSION['username']) ?>! Here is your summary for <?= date('F Y') ?>.</p>

<div class="cardcontainer">
    <div class="card" onclick="location.href='attendance.php'">
        <p class="cardtitle">Present Days</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0;"><?= $present_days ?></h1>
        <p class="cardinfo">This Month</p>
    </div>
    <div class="card" onclick="location.href='my_leaves.php'">
        <p class="cardtitle">Approved Leaves</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0; color: #1bd760;"><?= $approved_leaves ?></h1>
        <p class="cardinfo">View Details</p>
    </div>
    <div class="card" onclick="location.href='my_leaves.php'">
        <p class="cardtitle">Pending Leaves</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0; color: #e22134;"><?= $pending_leaves ?></h1>
        <p class="cardinfo">Track Leaves</p>
    </div>
    <div class="card" onclick="location.href='attendance.php'">
        <p class="cardtitle">Overall Attendance</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0; color: #1bd760;"><?= $attendance_pct ?>%</h1>
        <p class="cardinfo">All-time record</p>
    </div>
    <div class="card" onclick="location.href='my_leaves.php'">
        <p class="cardtitle">Total Leaves</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0; color: #a7a7a7;"><?= $total_leaves_taken ?></h1>
        <p class="cardinfo">All-time Approved</p>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>
