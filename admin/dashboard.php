<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');

// Get counts
$total_emps = $conn->query("SELECT COUNT(*) as count FROM employees")->fetch_assoc()['count'];

$pending_leaves = $conn->query("SELECT COUNT(*) as count FROM leaves WHERE status = 'Pending'")->fetch_assoc()['count'];

$today = date('Y-m-d');

$present_today = $conn->query("
    SELECT COUNT(*) as count 
    FROM attendance 
    WHERE date = '$today' AND status = 'Present'
")->fetch_assoc()['count'];


// 🔥 UPDATED QUERY (USES FUNCTIONS + CORRECT COLUMNS)
$top_performers = $conn->query("
    SELECT 
        e.emp_id,
        e.name,
        e.department,
        attendance_percentage(e.emp_id) AS attendance_pct
    FROM employees e
    ORDER BY attendance_pct DESC
    LIMIT 5
");

require_once '../includes/header.php';
?>

<h2 style="margin-bottom: 0.5rem;">Admin Dashboard</h2>
<p style="color: #a7a7a7; margin-bottom: 2rem;">
    Welcome, <?= htmlspecialchars($_SESSION['username']) ?>! Here is the system overview.
</p>

<div class="cardcontainer">
    <div class="card" onclick="location.href='employees.php'">
        <p class="cardtitle">Total Employees</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0;"><?= $total_emps ?></h1>
        <p class="cardinfo">Manage all staff</p>
    </div>

    <div class="card" onclick="location.href='leaves.php'">
        <p class="cardtitle">Pending Leaves</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0; color: #1bd760;">
            <?= $pending_leaves ?>
        </h1>
        <p class="cardinfo">Review requests</p>
    </div>

    <div class="card" onclick="location.href='attendance.php'">
        <p class="cardtitle">Present Today</p>
        <h1 style="font-size: 3rem; margin: 0.5rem 0;">
            <?= $present_today ?>
        </h1>
        <p class="cardinfo">Daily attendance</p>
    </div>
</div>

<div class="row mt-4">

    <!-- 🔥 TOP PERFORMERS -->
    <div class="col-md-6">
        <div class="card p-3" style="background-color: #181818;">
            <h4 style="color: #1bd760;">Top Performers</h4>

            <table class="table table-dark table-striped mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Dept</th>
                        <th>Attendance %</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $top_performers->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['name']) ?></td>
                        <td><?= htmlspecialchars($row['department']) ?></td>
                        <td><?= round($row['attendance_pct'], 2) ?>%</td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 🔥 REPORTS -->
    <div class="col-md-6">
        <div class="card p-3" style="background-color: #181818;">
            <h4 style="color: #1bd760;">Reports & Summaries</h4>

            <div class="mt-3">
                <a href="attendance_report.php" class="btn btn-outline-success w-100 mb-3">
                    View Monthly Attendance Report
                </a>

                <a href="leave_summary.php" class="btn btn-outline-warning w-100">
                    View Today's Leave Summary
                </a>
            </div>
        </div>
    </div>

</div>

<?php require_once '../includes/footer.php'; ?>
