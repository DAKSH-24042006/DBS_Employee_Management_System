<?php
require_once 'config/database.php';
require_once 'auth/auth_functions.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (isLoggedIn()) {
    $role = $_SESSION['role'];
    if ($role === 'Admin') header('Location: admin/dashboard.php');
    elseif ($role === 'Manager') header('Location: manager/dashboard.php');
    elseif ($role === 'Employee') header('Location: employee/dashboard.php');
    exit();
}
require_once 'includes/header.php';
?>
<div style="text-align: center; padding-top: 5rem; max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 4rem; font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -2px;">Employee Management System</h1>
    <p style="color: #a7a7a7; font-size: 1.25rem; margin-bottom: 2.5rem;">A complete solution to manage attendance and leave requests efficiently with role-based access control.</p>
    <a href="login.php" class="badge" style="padding: 1rem 2.5rem; font-size: 1.2rem;">Login to Continue</a>
</div>
<?php require_once 'includes/footer.php'; ?>
