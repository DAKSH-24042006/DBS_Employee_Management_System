<?php
// config/database.php

$host = 'localhost';
$username = 'root'; // default XAMPP username
$password = 'dwaraka2442006'; // default XAMPP password
$database = "employee_db";

// Create connection
$conn = new mysqli($host, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$conn->query("CREATE DATABASE IF NOT EXISTS $database");
$conn->select_db($database);

// Optional: You could read the schema.sql and execute it here if tables don't exist, 
// but typically we'll assume the user imports schema.sql into MySQL.

// Set charset
$conn->set_charset("utf8mb4");

// Start sessions globally
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Global Error Reporting for Debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
