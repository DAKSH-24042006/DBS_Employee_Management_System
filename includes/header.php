<?php
if(session_status() === PHP_SESSION_NONE) {
    session_start();
}
$is_login_page = (basename($_SERVER['PHP_SELF']) === 'login.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Management System</title>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <!-- Custom Styles -->
    <link href="/employee_system/assets/css/style.css" rel="stylesheet">
</head>
<body>

<?php if(!$is_login_page && isset($_SESSION['user_id'])): ?>
<div class="main">
    <?php include 'sidebar.php'; ?>
    
    <div class="maincontent">
        <div class="stickynav">
            <div class="stickynavoptions">
                <?php if(isset($_SESSION['username'])): ?>
                    <span style="color: white; font-weight: 600; margin-right: 10px;">Hello, <?= htmlspecialchars($_SESSION['username']) ?></span>
                <?php endif; ?>
                <a href="/employee_system/logout.php" class="badge darkbadge"><i class="fa-solid fa-arrow-right-from-bracket" style="margin-right: 5px;"></i> Logout</a>
            </div>
        </div>
<?php elseif($is_login_page): ?>
<div class="login-wrapper">
<?php else: ?>
<!-- Fallback if not logged in and not on login page -->
<div class="main">
    <div class="maincontent">
<?php endif; ?>
