<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');
require_once '../includes/header.php';

$filter_date = $_GET['date'] ?? date('Y-m-d');
$sql = "SELECT a.*, e.name, e.department FROM attendance a JOIN employees e ON a.emp_id = e.emp_id WHERE a.date = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $filter_date);
$stmt->execute();
$result = $stmt->get_result();
?>
<div class="row mb-4">
    <div class="col-md-12">
        <h2>Attendance Records</h2>
    </div>
</div>

<form class="mb-4" method="GET" action="attendance.php">
    <div class="row align-items-end">
        <div class="col-md-3">
            <label>Filter by Date</label>
            <input type="date" name="date" class="form-control" value="<?= htmlspecialchars($filter_date) ?>">
        </div>
        <div class="col-md-2">
            <button class="btn btn-primary" type="submit">Filter</button>
        </div>
    </div>
</form>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php if($result->num_rows > 0): ?>
                <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['attendance_id'] ?></td>
                    <td><?= htmlspecialchars($row['name']) ?></td>
                    <td><?= htmlspecialchars($row['department']) ?></td>
                    <td><?= $row['date'] ?></td>
                    <td><?= $row['check_in_time'] ?></td>
                    <td><?= $row['check_out_time'] ?? 'Not Checked Out' ?></td>
                    <td>
                        <?php if($row['status'] == 'Present'): ?>
                            <span class="badge bg-success">Present</span>
                        <?php elseif($row['status'] == 'Late'): ?>
                            <span class="badge bg-warning text-dark">Late</span>
                        <?php else: ?>
                            <span class="badge bg-secondary"><?= $row['status'] ?></span>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="7" class="text-center">No attendance records found for this date.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>
<?php require_once '../includes/footer.php'; ?>
