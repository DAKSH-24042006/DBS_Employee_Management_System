<?php
require_once '../config/database.php';
require_once '../auth/auth_functions.php';

checkRole('Admin');
require_once '../includes/header.php';

$search = $_GET['search'] ?? '';

$sql = "SELECT e.*, u.username, u.role FROM employees e JOIN users u ON e.emp_id = u.user_id";
if ($search) {
    $search_esc = $conn->real_escape_string($search);
    $sql .= " WHERE e.name LIKE '%$search_esc%' OR e.department LIKE '%$search_esc%'";
}
$result = $conn->query($sql);
?>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <h2 style="margin: 0;">Manage Employees</h2>
    <a href="add_employee.php" class="badge bg-success" style="text-decoration:none;"><i class="fa-solid fa-plus"></i> Add New Employee</a>
</div>

<form class="mb-4" method="GET" action="employees.php" style="display: flex; gap: 1rem; max-width: 500px;">
    <input type="text" name="search" class="form-control" placeholder="Search by name or department..." value="<?= htmlspecialchars($search) ?>">
    <button class="badge" type="submit">Search</button>
</form>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Contact</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if($result->num_rows > 0): ?>
                <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['emp_id'] ?></td>
                    <td><?= htmlspecialchars($row['name']) ?></td>
                    <td><?= htmlspecialchars($row['username']) ?></td>
                    <td><?= htmlspecialchars($row['role']) ?></td>
                    <td><?= htmlspecialchars($row['department']) ?></td>
                    <td><?= htmlspecialchars($row['designation']) ?></td>
                    <td><?= htmlspecialchars($row['contact_details']) ?></td>
                    <td>
                        <a href="edit_employee.php?id=<?= $row['emp_id'] ?>" class="badge" style="background-color: #333; color: white; padding: 0.4rem 1rem;">Edit</a>
                        <a href="delete_employee.php?id=<?= $row['emp_id'] ?>" class="badge" style="background-color: #e22134; color: white; padding: 0.4rem 1rem;" onclick="return confirm('Are you sure you want to delete this employee?');">Delete</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="8" class="text-center">No employees found.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>
<?php require_once '../includes/footer.php'; ?>
