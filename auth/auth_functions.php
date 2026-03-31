<?php
// auth/auth_functions.php

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /employee_system/login.php');
        exit();
    }
}

function checkRole($role) {
    if (!isLoggedIn() || $_SESSION['role'] !== $role) {
        header('Location: /employee_system/index.php');
        exit();
    }
}

function hasRole($role) {
    return isset($_SESSION['role']) && $_SESSION['role'] === $role;
}

function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

function sanitizeInput($conn, $input) {
    return mysqli_real_escape_string($conn, htmlspecialchars(strip_tags(trim($input))));
}
?>
