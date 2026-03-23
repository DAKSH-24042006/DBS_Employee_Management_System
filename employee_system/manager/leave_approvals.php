<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Manager');

$manager_id = $_SESSION['user_id'];
$dept_query = $conn->query("SELECT department FROM employees WHERE emp_id = $manager_id")->fetch_assoc();
$manager_dept = $dept_query['department'] ?? '';

$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['leave_id'])) {
    $leave_id = intval($_POST['leave_id']);
    $action = $_POST['action'] === 'approve' ? 'Approved' : 'Rejected';
    $remarks = sanitizeInput($conn, $_POST['remarks'] ?? '');

    if ($action === 'Approved') {
        $stmt = $conn->prepare("CALL ApproveLeave(?, ?, ?)");
    } else {
        $stmt = $conn->prepare("CALL RejectLeave(?, ?, ?)");
    }
    $stmt->bind_param("iis", $leave_id, $manager_id, $remarks);
    
    if ($stmt->execute()) {
        $msg = "<div class='alert alert-success'>Leave request $action successfully.</div>";
    } else {
        $msg = "<div class='alert alert-danger'>Error processing leave: " . $conn->error . "</div>";
    }
}

$sql = "SELECT l.*, e.name FROM leaves l JOIN employees e ON l.emp_id = e.emp_id WHERE e.department = ? ORDER BY l.application_date DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $manager_dept);
$stmt->execute();
$result = $stmt->get_result();

require_once '../includes/header.php';
?>
<div class="row mb-4">
    <div class="col-md-12">
        <h2>Department Leave Approvals</h2>
    </div>
</div>
<?= $msg ?>
<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>Leave ID</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php if($result->num_rows > 0): ?>
                <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['leave_id'] ?></td>
                    <td><?= htmlspecialchars($row['name']) ?></td>
                    <td><?= htmlspecialchars($row['leave_type']) ?></td>
                    <td><?= $row['start_date'] ?> to <?= $row['end_date'] ?></td>
                    <td><?= htmlspecialchars($row['reason']) ?></td>
                    <td>
                        <?php if($row['status'] == 'Pending'): ?>
                            <span class="badge bg-warning text-dark">Pending</span>
                        <?php elseif($row['status'] == 'Approved'): ?>
                            <span class="badge bg-success">Approved</span>
                        <?php else: ?>
                            <span class="badge bg-danger">Rejected</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if($row['status'] == 'Pending'): ?>
                            <form method="POST" action="leave_approvals.php" class="d-inline">
                                <input type="hidden" name="leave_id" value="<?= $row['leave_id'] ?>">
                                <input type="hidden" name="action" value="approve">
                                <button type="submit" class="btn btn-sm btn-success">Approve</button>
                            </form>
                            <form method="POST" action="leave_approvals.php" class="d-inline">
                                <input type="hidden" name="leave_id" value="<?= $row['leave_id'] ?>">
                                <input type="hidden" name="action" value="reject">
                                <button type="submit" class="btn btn-sm btn-danger">Reject</button>
                            </form>
                        <?php else: ?>
                            <span class="text-muted">Processed</span>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="7" class="text-center">No leave applications found in your department.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>
<?php require_once '../includes/footer.php'; ?>
