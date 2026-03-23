<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Employee');

$emp_id = $_SESSION['user_id'];
$sql = "SELECT * FROM leaves WHERE emp_id = $emp_id ORDER BY application_date DESC";
$result = $conn->query($sql);

require_once '../includes/header.php';
?>
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>My Leaves</h2>
    <a href="apply_leave.php" class="btn btn-primary">Apply Leave</a>
</div>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>Leave ID</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php if($result->num_rows > 0): ?>
                <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['leave_id'] ?></td>
                    <td><?= htmlspecialchars($row['leave_type']) ?></td>
                    <td><?= $row['start_date'] ?></td>
                    <td><?= $row['end_date'] ?></td>
                    <td><?= htmlspecialchars($row['reason']) ?></td>
                    <td><?= date('Y-m-d', strtotime($row['application_date'])) ?></td>
                    <td>
                        <?php if($row['status'] == 'Pending'): ?>
                            <span class="badge bg-warning text-dark">Pending</span>
                        <?php elseif($row['status'] == 'Approved'): ?>
                            <span class="badge bg-success">Approved</span>
                        <?php else: ?>
                            <span class="badge bg-danger">Rejected</span>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="7" class="text-center">No leave applications found.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>
<?php require_once '../includes/footer.php'; ?>
