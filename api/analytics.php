<?php
// api/analytics.php
require_once 'db_connection.php';

$emp_id = $_GET['emp_id'] ?? ($_SESSION['user_id'] ?? null);
$role = $_GET['role'] ?? ($_SESSION['role'] ?? null);

if (!$emp_id) {
    jsonResponse(false, "Authentication required.");
}

if ($role === 'Admin' || $role === 'Manager') {
    // Standard Dashboard (Company-wide) - Calculate based on total days instead of request count
    $sql1 = "SELECT e.name, COALESCE(SUM(CASE WHEN l.status = 'Approved' THEN DATEDIFF(l.end_date, l.start_date) + 1 ELSE 0 END), 0) AS total_leaves 
             FROM employees e 
             LEFT JOIN leaves l ON e.emp_id = l.emp_id 
             GROUP BY e.emp_id, e.name 
             ORDER BY total_leaves DESC";
             
    $sql2 = "SELECT l.*, e.name FROM leaves l JOIN employees e ON l.emp_id = e.emp_id WHERE l.status = 'Pending'";
    
    $sql3 = "SELECT e.name, SUM(DATEDIFF(l.end_date, l.start_date) + 1) AS leave_count 
             FROM employees e 
             JOIN leaves l ON e.emp_id = l.emp_id 
             WHERE l.status = 'Approved'
             GROUP BY e.emp_id, e.name 
             ORDER BY leave_count DESC LIMIT 5";
             
    // Department-wise LEAVE distribution (Already there)
    $sql4 = "SELECT department, SUM(DATEDIFF(l.end_date, l.start_date) + 1) AS leave_count 
             FROM employees e 
             JOIN leaves l ON e.emp_id = l.emp_id 
             WHERE l.status = 'Approved'
             GROUP BY department";

    // NEW: Department-wise ATTENDANCE distribution (Today)
    $sql5 = "SELECT department, COUNT(a.attendance_id) AS present_count 
             FROM employees e 
             LEFT JOIN attendance a ON e.emp_id = a.emp_id AND a.date = CURDATE()
             GROUP BY department";
             
    $sql_emp_count = "SELECT COUNT(*) as count FROM employees";
    $sql_present_today = "SELECT COUNT(*) as present FROM attendance WHERE date = CURDATE()";
    
    $res1 = $conn->query($sql1);
    $res2 = $conn->query($sql2);
    $res3 = $conn->query($sql3);
    $res4 = $conn->query($sql4);
    $res5 = $conn->query($sql5);
    $res_count = $conn->query($sql_emp_count);
    $res_present = $conn->query($sql_present_today);
    
    $leave_analytics = []; while ($row = $res1->fetch_assoc()) $leave_analytics[] = $row;
    $pending_leaves = []; while ($row = $res2->fetch_assoc()) $pending_leaves[] = $row;
    $top_leave_takers = []; while ($row = $res3->fetch_assoc()) $top_leave_takers[] = $row;
    $department_analytics = []; while ($row = $res4->fetch_assoc()) $department_analytics[] = $row;
    $department_attendance = []; while ($row = $res5->fetch_assoc()) $department_attendance[] = $row;
    $emp_count = $res_count->fetch_assoc()['count'];
    $present_today = $res_present->fetch_assoc()['present'];

    jsonResponse(true, "Company analytics retrieved.", [
        'total_employees' => $emp_count,
        'present_today' => $present_today,
        'pending_leaves_count' => count($pending_leaves),
        'top_leave_takers' => $top_leave_takers,
        'department_analytics' => $department_analytics,
        'department_attendance' => $department_attendance,
        'leave_analytics' => $leave_analytics,
        'role' => $role
    ]);
} else {
    // Employee Dashboard (Personal)
    $sql_personal = "SELECT 
        (SELECT COUNT(*) FROM leaves WHERE emp_id = $emp_id) as total_applied,
        (SELECT COUNT(*) FROM leaves WHERE emp_id = $emp_id AND status = 'Approved') as total_approved,
        (SELECT COUNT(*) FROM leaves WHERE emp_id = $emp_id AND status = 'Pending') as total_pending,
        (SELECT COALESCE(SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(check_out_time, check_in_time)))), '00:00:00') FROM attendance WHERE emp_id = $emp_id) as total_hours
    ";
    $res = $conn->query($sql_personal);
    $personal_stats = $res->fetch_assoc();
    
    // Get leave balance
    $sql_balance = "SELECT * FROM leave_balances WHERE emp_id = $emp_id";
    $res_balance = $conn->query($sql_balance);
    $balance = $res_balance->fetch_assoc();

    // Get today's attendance status
    $sql_today = "SELECT * FROM attendance WHERE emp_id = $emp_id AND date = CURDATE()";
    $res_today = $conn->query($sql_today);
    $today_attendance = $res_today->fetch_assoc();

    jsonResponse(true, "Personal analytics retrieved.", [
        'personal_stats' => $personal_stats,
        'leave_balance' => $balance,
        'today_attendance' => $today_attendance,
        'role' => 'Employee'
    ]);
}
?>
