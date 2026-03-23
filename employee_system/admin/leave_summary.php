<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');

// Advanced Query: Employees on leave today
$today = date('Y-m-d');
$on_leave_today = $conn->query("
    SELECT e.name, e.department, l.leave_type, l.reason 
    FROM leaves l 
    JOIN employees e ON l.emp_id = e.emp_id 
    WHERE '$today' BETWEEN l.start_date AND l.end_date 
      AND l.status = 'Approved'
");

require_once '../includes/header.php';
?>
<div class="row mb-4">
    <div class="col-md-12">
        <h2>Today's Leave Summary</h2>
    </div>
</div>

<div class="card bg-dark text-white p-3">
    <h4 class="text-warning">Employees On Leave (<?= $today ?>)</h4>
    <div class="table-responsive mt-3">
        <table class="table table-dark table-striped">
            <thead>
                <tr><th>Employee Name</th><th>Department</th><th>Leave Type</th><th>Reason</th></tr>
            </thead>
            <tbody>
                <?php if($on_leave_today->num_rows > 0): ?>
                    <?php while($row = $on_leave_today->fetch_assoc()): ?>
                        <tr>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td><?= htmlspecialchars($row['department']) ?></td>
                            <td><?= htmlspecialchars($row['leave_type']) ?></td>
                            <td><?= htmlspecialchars($row['reason']) ?></td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr><td colspan="4" class="text-center">No employees are on leave today.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
