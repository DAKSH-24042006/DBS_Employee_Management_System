<?php
require_once 'config/database.php';
require_once 'auth/auth_functions.php';

checkRole(['Admin', 'Manager']);

// Complex Query 1: Total leaves per employee (descending)
$res1 = $conn->query("SELECT e.name, COUNT(l.leave_id) AS total_leaves FROM employees e LEFT JOIN leaves l ON e.emp_id = l.emp_id GROUP BY e.emp_id, e.name ORDER BY total_leaves DESC");

// Complex Query 2: Pending Leave Requests
$res2 = $conn->query("SELECT l.*, e.name FROM leaves l JOIN employees e ON l.emp_id = e.emp_id WHERE l.status = 'Pending'");

// Complex Query 3: Top 5 Employees with Highest Leaves
$res3 = $conn->query("SELECT e.name, COUNT(l.leave_id) AS leave_count FROM employees e JOIN leaves l ON e.emp_id = l.emp_id GROUP BY e.emp_id, e.name ORDER BY leave_count DESC LIMIT 5");

// Complex Query 4: Department-wise leave count
$res4 = $conn->query("SELECT department, COUNT(l.leave_id) AS leave_count FROM employees e JOIN leaves l ON e.emp_id = l.emp_id GROUP BY department");

require_once 'includes/header.php';
?>

<div class="container mt-4">
    <h1 class="mb-4">Leave Analytics Dashboard</h1>
    
    <div class="row">
        <!-- Top 5 Leave Takers -->
        <div class="col-md-6 mb-4">
            <div class="card bg-dark text-white border-secondary h-100">
                <div class="card-header border-secondary">
                    <h5 class="mb-0">Top 5 Leave Takers</h5>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover mb-0">
                        <thead>
                            <tr><th>Employee</th><th>Count</th></tr>
                        </thead>
                        <tbody>
                            <?php while($row = $res3->fetch_assoc()): ?>
                                <tr>
                                    <td><?= htmlspecialchars($row['name']) ?></td>
                                    <td><span class="badge bg-danger"><?= $row['leave_count'] ?></span></td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Department-wise Leaves -->
        <div class="col-md-6 mb-4">
            <div class="card bg-dark text-white border-secondary h-100">
                <div class="card-header border-secondary">
                    <h5 class="mb-0">Department-wise Analytics</h5>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover mb-0">
                        <thead>
                            <tr><th>Department</th><th>Leaves</th></tr>
                        </thead>
                        <tbody>
                            <?php while($row = $res4->fetch_assoc()): ?>
                                <tr>
                                    <td><?= htmlspecialchars($row['department']) ?></td>
                                    <td><span class="badge bg-info"><?= $row['leave_count'] ?></span></td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Total Leaves per Employee -->
    <div class="row">
        <div class="col-md-12 mb-4">
            <div class="card bg-dark text-white border-secondary">
                <div class="card-header border-secondary">
                    <h5 class="mb-0">Full Employee Leave Analytics</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dark table-striped table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Total Leaves Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while($row = $res1->fetch_assoc()): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($row['name']) ?></td>
                                        <td><?= $row['total_leaves'] ?></td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Pending Requests List -->
    <div class="row">
        <div class="col-md-12 mb-4">
            <div class="card bg-dark text-white border-secondary">
                <div class="card-header border-secondary">
                    <h5 class="mb-0">Pending Leave Requests</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dark table-striped table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Employee</th>
                                    <th>Type</th>
                                    <th>Dates</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if($res2->num_rows > 0): ?>
                                    <?php while($row = $res2->fetch_assoc()): ?>
                                        <tr>
                                            <td><?= $row['leave_id'] ?></td>
                                            <td><?= htmlspecialchars($row['name']) ?></td>
                                            <td><?= $row['leave_type'] ?></td>
                                            <td><?= $row['start_date'] ?> to <?= $row['end_date'] ?></td>
                                            <td><span class="badge bg-warning text-dark">Pending</span></td>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr><td colspan="5" class="text-center py-3">No pending requests</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once 'includes/header.php'; ?>
