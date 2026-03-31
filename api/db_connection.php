<?php
// api/db_connection.php
header('Content-Type: application/json');

// CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
if (strpos($origin, 'http://localhost:') === 0) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}


require_once '../config/database.php';

function jsonResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

function sanitizeInput($conn, $data) {
    return mysqli_real_escape_string($conn, trim($data));
}
?>
