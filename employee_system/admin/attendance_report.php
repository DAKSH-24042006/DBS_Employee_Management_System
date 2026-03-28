<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');

// Advanced Query: Employees with < 75% attendance
$low_attendance = $conn->query("
    SELECT name, department, attendance_pct 
    FROM employee_summary 
    WHERE attendance_pct < 75 
    ORDER BY attendance_pct ASC
");

// Advanced Query: Monthly attendance report
$current_month = date('m');
$current_year = date('Y');
$monthly_report = $conn->query("
    SELECT e.name, COUNT(a.attendance_id) as days_present 
    FROM employees e 
    JOIN attendance a ON e.emp_id = a.emp_id 
    WHERE MONTH(a.date) = '$current_month' AND YEAR(a.date) = '$current_year' 
      AND a.status IN ('Present', 'Late', 'Half Day')
    GROUP BY e.emp_id
");

require_once '../includes/header.php';
?>
<div class="row mb-4">
    <div class="col-md-12">
        <h2>Attendance Report</h2>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-6">
        <div class="card bg-dark text-white p-3">
            <h4 class="text-danger">Needs Improvement (< 75% Attendance)</h4>
            <table class="table table-dark mt-3">
                <thead><tr><th>Employee Name</th><th>Department</th><th>Attendance</th></tr></thead>
                <tbody>
                    <?php if($low_attendance->num_rows > 0): ?>
                        <?php while($row = $low_attendance->fetch_assoc()): ?>
                            <tr>
                                <td><?= htmlspecialchars($row['name']) ?></td>
                                <td><?= htmlspecialchars($row['department']) ?></td>
                                <td class="text-danger"><?= $row['attendance_pct'] ?>%</td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="3" class="text-center">No employees under 75% attendance. Great!</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
    
    <div class="col-md-6">
        <div class="card bg-dark text-white p-3">
            <h4 class="text-info">Monthly Report (<?= date('F Y') ?>)</h4>
            <table class="table table-dark mt-3">
                <thead><tr><th>Employee Name</th><th>Days Present</th></tr></thead>
                <tbody>
                    <?php if($monthly_report->num_rows > 0): ?>
                        <?php while($row = $monthly_report->fetch_assoc()): ?>
                            <tr>
                                <td><?= htmlspecialchars($row['name']) ?></td>
                                <td><?= $row['days_present'] ?> days</td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="2" class="text-center">No attendance data for this month.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
