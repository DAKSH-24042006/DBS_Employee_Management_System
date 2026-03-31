<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Employee');

$emp_id = $_SESSION['user_id'];
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $leave_type = $_POST['leave_type']; // kept for UI (optional use later)
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    $reason = sanitizeInput($conn, $_POST['reason']);

    // 🔥 Validate dates
    if (strtotime($start_date) > strtotime($end_date)) {
        $msg = "<div class='alert alert-danger'>End date must be after Start date.</div>";
    } else {

        // 🔥 IMPORTANT: clear previous results (fix for CALL issues)
        while ($conn->more_results() && $conn->next_result()) {;}

        // ✅ FIXED: only 4 parameters
        $stmt = $conn->prepare("CALL ApplyLeave(?, ?, ?, ?)");
        
        if ($stmt) {
            $stmt->bind_param("isss", $emp_id, $start_date, $end_date, $reason);

            if ($stmt->execute()) {
                $msg = "<div class='alert alert-success'>Leave application submitted successfully.</div>";
            } else {
                $msg = "<div class='alert alert-danger'>Error submitting application: " . $stmt->error . "</div>";
            }

            $stmt->close();
        } else {
            $msg = "<div class='alert alert-danger'>Prepare failed: " . $conn->error . "</div>";
        }
    }
}

require_once '../includes/header.php';
?>

<div style="max-width: 600px; margin: 0 auto;">
    <div class="card" style="width: auto; padding: 2rem; cursor: default; background-color: #181818;">
        <h2 style="margin-top: 0; border-bottom: 1px solid #282828; padding-bottom: 1rem; margin-bottom: 2rem;">
            Apply for Leave
        </h2>
        
        <div class="card-body" style="padding: 0;">
            <?= $msg ?>

            <form action="apply_leave.php" method="POST" style="text-align: left;">
                
                <div style="margin-bottom: 1.5rem;">
                    <label class="form-label">Leave Type</label>
                    <select name="leave_type" class="form-select" required>
                        <option value="Casual">Casual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Earned">Earned Leave</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">Start Date</label>
                        <input type="date" name="start_date" class="form-control" required>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">End Date</label>
                        <input type="date" name="end_date" class="form-control" required>
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <label class="form-label">Reason</label>
                    <textarea name="reason" class="form-control" rows="4" required
                        placeholder="State your reason for leave..."
                        style="background-color: #333; color: white; border: 1px solid transparent; width: 100%; padding: 0.75rem 1rem; border-radius: 4px;">
                    </textarea>
                </div>
                
                <button type="submit" class="badge" style="width: 100%; padding: 0.75rem; font-size: 1rem; margin-bottom: 1rem;">
                    Submit Application
                </button>
                
                <div style="text-align: center;">
                    <a href="my_leaves.php" style="color: #a7a7a7; text-decoration: none; font-size: 0.9rem;">
                        View My Leaves →
                    </a>
                </div>

            </form>
        </div>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?>
