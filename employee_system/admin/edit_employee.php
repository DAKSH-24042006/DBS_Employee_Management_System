<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');

if (!isset($_GET['id'])) {
    header('Location: employees.php');
    exit();
}

$emp_id = intval($_GET['id']);
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitizeInput($conn, $_POST['name']);
    $department = sanitizeInput($conn, $_POST['department']);
    $designation = sanitizeInput($conn, $_POST['designation']);
    $contact_details = sanitizeInput($conn, $_POST['contact_details']);
    $role = $_POST['role'];

    $conn->begin_transaction();
    $stmt_emp = $conn->prepare("UPDATE employees SET name=?, department=?, designation=?, contact_details=? WHERE emp_id=?");
    $stmt_emp->bind_param("ssssi", $name, $department, $designation, $contact_details, $emp_id);
    
    $stmt_user = $conn->prepare("UPDATE users SET role=? WHERE user_id=?");
    $stmt_user->bind_param("si", $role, $emp_id);
    
    if ($stmt_emp->execute() && $stmt_user->execute()) {
        $conn->commit();
        $msg = "<div class='alert alert-success'>Employee updated successfully.</div>";
    } else {
        $conn->rollback();
        $msg = "<div class='alert alert-danger'>Error updating employee: " . $conn->error . "</div>";
    }
}

$stmt = $conn->prepare("CALL GetEmployee(?)");
$stmt->bind_param("i", $emp_id);
$stmt->execute();
$result = $stmt->get_result();
if($result->num_rows == 0) die('Employee not found');
$emp = $result->fetch_assoc();
while($conn->more_results() && $conn->next_result()){ if($res = $conn->store_result()) $res->free(); }

require_once '../includes/header.php';
?>
<div class="row">
    <div class="col-md-8 mx-auto">
        <div class="card">
            <div class="card-header bg-info text-white">
                <h4>Edit Employee</h4>
            </div>
            <div class="card-body">
                <?= $msg ?>
                <form action="edit_employee.php?id=<?= $emp_id ?>" method="POST">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label>Username (Cannot be changed here)</label>
                            <input type="text" class="form-control" value="<?= htmlspecialchars($emp['username']) ?>" readonly>
                        </div>
                        <div class="col-md-6">
                            <label>Role</label>
                            <select name="role" class="form-select" required>
                                <option value="Employee" <?= ($emp['role']=='Employee')?'selected':'' ?>>Employee</option>
                                <option value="Manager" <?= ($emp['role']=='Manager')?'selected':'' ?>>Manager</option>
                                <option value="Admin" <?= ($emp['role']=='Admin')?'selected':'' ?>>Admin</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label>Full Name</label>
                            <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($emp['name']) ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label>Contact Details</label>
                            <input type="text" name="contact_details" class="form-control" value="<?= htmlspecialchars($emp['contact_details']) ?>" required>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label>Department</label>
                            <input type="text" name="department" class="form-control" value="<?= htmlspecialchars($emp['department']) ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label>Designation</label>
                            <input type="text" name="designation" class="form-control" value="<?= htmlspecialchars($emp['designation']) ?>" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-info text-white">Update Employee</button>
                    <a href="employees.php" class="btn btn-secondary">Back</a>
                </form>
            </div>
        </div>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>
