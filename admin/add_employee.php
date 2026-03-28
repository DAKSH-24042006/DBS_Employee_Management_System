<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');

$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($conn, $_POST['username']);
    $original_password = $_POST['password'];
    $password = password_hash($original_password, PASSWORD_DEFAULT);
    $role = $_POST['role'];
    
    $name = sanitizeInput($conn, $_POST['name']);
    $department = sanitizeInput($conn, $_POST['department']);
    $designation = sanitizeInput($conn, $_POST['designation']);
    $contact_details = sanitizeInput($conn, $_POST['contact_details']);
    $date_of_joining = $_POST['date_of_joining'];

    // Bonus: Check if username already exists
    $check_stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
    $check_stmt->bind_param("s", $username);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows > 0) {
        $msg = "<div style='background-color: #e22134; color: white; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; font-weight: bold;'>Username already exists. Please choose a different one.</div>";
    } else {
        $stmt_emp = $conn->prepare("CALL AddEmployee(?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt_emp->bind_param("ssssssss", $name, $contact_details, $designation, $username, $password, $role, $department, $date_of_joining);
        
        if ($stmt_emp->execute()) {
            $msg = "<div style='background-color: #1bd760; color: black; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; font-weight: bold;'>Employee created successfully.</div>";
        } else {
            $msg = "<div style='background-color: #e22134; color: white; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; font-weight: bold;'>Error creating employee: " . $conn->error . "</div>";
        }
    }
}

require_once '../includes/header.php';
?>
<div style="max-width: 800px; margin: 0 auto;">
    <div class="card" style="width: auto; padding: 2rem; cursor: default; background-color: #181818;">
        <h2 style="margin-top: 0; border-bottom: 1px solid #282828; padding-bottom: 1rem; margin-bottom: 2rem;">Add New Employee</h2>
        
        <div class="card-body" style="padding: 0;">
            <?= $msg ?>
            <form action="add_employee.php" method="POST">
                
                <h3 style="color: #1bd760; margin-bottom: 1.5rem; font-size: 1.2rem;">Account Details</h3>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">Username</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">Role</label>
                        <select name="role" class="form-select" required style="width: 100%;">
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>
                
                <hr style="border-color: #282828; margin: 2rem 0;">
                
                <h3 style="color: #1bd760; margin-bottom: 1.5rem; font-size: 1.2rem;">Personal Details</h3>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 250px;">
                        <label class="form-label">Full Name</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <div style="flex: 1; min-width: 250px;">
                        <label class="form-label">Contact Details (Email/Phone)</label>
                        <input type="text" name="contact_details" class="form-control" required>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">Department</label>
                        <input type="text" name="department" class="form-control" required>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">Designation</label>
                        <input type="text" name="designation" class="form-control" required>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label">Date of Joining</label>
                        <input type="date" name="date_of_joining" class="form-control" required>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="badge bg-success" style="font-size: 1rem;"><i class="fa-solid fa-check"></i> Save Employee</button>
                    <a href="employees.php" class="badge" style="background-color: transparent; border: 1px solid #727272; color: white; display: flex; align-items: center; justify-content: center;">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>
