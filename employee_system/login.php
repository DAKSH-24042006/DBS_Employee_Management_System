<?php
require_once 'config/database.php';
require_once 'auth/auth_functions.php';

// Start session safely
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// If already logged in, redirect
if (isLoggedIn()) {
    header('Location: index.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($conn, $_POST['username']);
    $password = $_POST['password'];

    // Fetch user
    $stmt = $conn->prepare("SELECT user_id, username, password, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {

        // ✅ CORRECT PASSWORD CHECK
        if (password_verify($password, $row['password'])) {

            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['role'] = $row['role'];

            header('Location: index.php');
            exit();

        } else {
            error_log("Login failed for user (wrong password): " . $username);
            $error = 'Invalid credentials';
        }

    } else {
        error_log("Login failed for user (user not found): " . $username);
        $error = 'Invalid credentials';
    }
}

require_once 'includes/header.php';
?>

<div class="login-card">
    <h2>EMS Login</h2>

    <?php if($error): ?>
        <div style="color: #e22134; margin-bottom: 1rem; font-weight: bold;">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form action="login.php" method="POST" style="text-align: left;">
        <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" name="username" class="form-control" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" required>
        </div>

        <button type="submit" class="badge" style="width: 100%; padding: 0.75rem; margin-top: 1rem;">
            Login
        </button>
    </form>
</div>