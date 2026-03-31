<?php
$current_page = $_SERVER['PHP_SELF'];
function isActive($page_path) {
    global $current_page;
    return (strpos($current_page, $page_path) !== false) ? 'active' : '';
}
?>
<div class="sidebar"> 
    <div class="nav">
        <div class="navoptions <?= isActive('index.php') ?>">
            <i class="fa-solid fa-house"></i>
            <a href="/employee_system/index.php">Dashboard</a>
        </div>
        
        <?php if(isset($_SESSION['role'])): ?>
            <?php if($_SESSION['role'] === 'Admin'): ?>
                <div class="navoptions <?= isActive('admin/employees.php') ?>">
                    <i class="fa-solid fa-users"></i>
                    <a href="/employee_system/admin/employees.php">Employees</a>
                </div>
                <div class="navoptions <?= isActive('admin/leaves.php') ?>">
                    <i class="fa-solid fa-calendar-minus"></i>
                    <a href="/employee_system/admin/leaves.php">Leaves</a>
                </div>
                <div class="navoptions <?= isActive('admin/attendance.php') ?>">
                    <i class="fa-solid fa-clock"></i>
                    <a href="/employee_system/admin/attendance.php">Attendance</a>
                </div>

            <?php elseif($_SESSION['role'] === 'Manager'): ?>
                <div class="navoptions <?= isActive('manager/leave_approvals.php') ?>">
                    <i class="fa-solid fa-clipboard-check"></i>
                    <a href="/employee_system/manager/leave_approvals.php">Leave Approvals</a>
                </div>
                <div class="navoptions <?= isActive('manager/attendance.php') ?>">
                    <i class="fa-solid fa-clock"></i>
                    <a href="/employee_system/manager/attendance.php">Dept Attendance</a>
                </div>

            <?php elseif($_SESSION['role'] === 'Employee'): ?>
                <div class="navoptions <?= isActive('employee/attendance.php') ?>">
                    <i class="fa-solid fa-clock"></i>
                    <a href="/employee_system/employee/attendance.php">My Attendance</a>
                </div>
                <div class="navoptions <?= isActive('employee/my_leaves.php') ?>">
                    <i class="fa-solid fa-calendar-minus"></i>
                    <a href="/employee_system/employee/my_leaves.php">My Leaves</a>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>

    <div class="library">
        <div class="options">
            <div class="libraryoptions navoptions">
                <i class="fa-solid fa-layer-group"></i>
                <a href="#">Quick Actions</a>
            </div>
        </div>
        
        <?php if(isset($_SESSION['role'])): ?>
            <?php if($_SESSION['role'] === 'Admin'): ?>
            <div class="librarybox">
                <div class="boxp1">Add New Employee</div>
                <div class="boxp2">Grow your team today</div>
                <a href="/employee_system/admin/add_employee.php" class="badge">Add Employee</a>
            </div>
            <?php elseif($_SESSION['role'] === 'Employee'): ?>
            <div class="librarybox">
                <div class="boxp1">Need a break?</div>
                <div class="boxp2">Submit your leave request</div>
                <a href="/employee_system/employee/apply_leave.php" class="badge">Apply Leave</a>
            </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</div>
