<?php
// api/login.php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    jsonResponse(false, "Username and password required.");
}

$username = sanitizeInput($conn, $data['username']);
$password = $data['password'];

$sql = "SELECT * FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        // Successful login
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        
        // Fetch employee details
        $emp_res = $conn->query("SELECT * FROM employees WHERE emp_id = " . $user['user_id']);
        $employee = $emp_res->fetch_assoc();
        
        jsonResponse(true, "Login successful.", [
            'user_id' => $user['user_id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'name' => $employee['name'] ?? 'User'
        ]);
    } else {
        jsonResponse(false, "Invalid password.");
    }
} else {
    jsonResponse(false, "User not found.");
}
?>
