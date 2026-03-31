<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Employee');

$emp_id = $_SESSION['user_id'];
$today = date('Y-m-d');
$now = date('H:i:s');
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'check_in') {
        // Status logic
        $status = (strtotime($now) > strtotime("09:30:00")) ? 'Late' : 'Present';
        $stmt = $conn->prepare("CALL MarkAttendance(?, ?, ?, ?)");
        $stmt->bind_param("isss", $emp_id, $today, $now, $status);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $msg = "<div class='alert alert-info'>" . $row['message'] . "</div>";
            }
            // Free results for next queries
            while($conn->more_results() && $conn->next_result()){ if($res = $conn->store_result()) $res->free(); }
        } else {
            $msg = "<div class='alert alert-danger'>Error marking attendance: " . $conn->error . "</div>";
        }
    } elseif ($_POST['action'] === 'check_out') {
        $stmt = $conn->prepare("UPDATE attendance SET check_out_time = ? WHERE emp_id = ? AND date = ? AND check_out_time IS NULL");
        $stmt->bind_param("sis", $now, $emp_id, $today);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $msg = "<div class='alert alert-success'>Checked out successfully at $now.</div>";
        } else {
            $msg = "<div class='alert alert-warning'>Already checked out or haven't checked in.</div>";
        }
    }
}

// Check current status
$today_attn = $conn->query("SELECT * FROM attendance WHERE emp_id = $emp_id AND date = '$today'")->fetch_assoc();

$history = $conn->query("SELECT * FROM attendance WHERE emp_id = $emp_id ORDER BY date DESC LIMIT 30");

require_once '../includes/header.php';
?>
<div class="row mb-4">
    <div class="col-md-12">
        <h2>My Attendance</h2>
    </div>
</div>

<?= $msg ?>

<div class="card mb-4 text-center">
    <div class="card-body">
        <h5 class="card-title">Mark Today's Attendance</h5>
        <p>Current Date: <?= $today ?></p>
        <?php if(!$today_attn): ?>
            <form method="POST" action="attendance.php" class="d-inline">
                <input type="hidden" name="action" value="check_in">
                <button type="submit" class="btn btn-primary btn-lg px-5">Check In</button>
            </form>
        <?php elseif(is_null($today_attn['check_out_time'])): ?>
            <p class="text-success">Checked In at: <?= $today_attn['check_in_time'] ?></p>
            <form method="POST" action="attendance.php" class="d-inline">
                <input type="hidden" name="action" value="check_out">
                <button type="submit" class="btn btn-warning btn-lg px-5">Check Out</button>
            </form>
        <?php else: ?>
            <p class="text-success">Attendance marked for today.</p>
            <p>Check-in: <?= $today_attn['check_in_time'] ?> | Check-out: <?= $today_attn['check_out_time'] ?></p>
        <?php endif; ?>
    </div>
</div>

<h4>Recent Attendance History</h4>
<div class="table-responsive">
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php if($history->num_rows > 0): ?>
                <?php while($row = $history->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['date'] ?></td>
                    <td><?= $row['check_in_time'] ?></td>
                    <td><?= $row['check_out_time'] ?? '-' ?></td>
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
                <tr><td colspan="4" class="text-center">No attendance records found.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require_once '../includes/footer.php'; ?>
