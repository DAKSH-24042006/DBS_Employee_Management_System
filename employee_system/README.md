# Employee Leave & Attendance Management System

This is a complete, production-ready, PHP and MySQL-based Employee Leaf & Attendance Management System.

## Features
- **Role-Based Access Control**: Admin, Manager, and Employee.
- **Employee Management**: CRUD operations for employee records.
- **Attendance Tracking**: Daily check-in/check-out system.
- **Leave Management**: Apply for leaves, track application status, approve/reject leaves.
- **Department-wise Filtering**: Managers can only see and manage their department's data.

## Setup Instructions

1. **Move to Web Server Directory**: 
   Ensure this `employee_system` folder is inside your local web server's document root (e.g., `htdocs` for XAMPP, or `/var/www/html` for Apache). The URL should be accessible at `http://localhost/employee_system`.

2. **Database Setup**:
   - Open phpMyAdmin or your MySQL CLI.
   - Create a database (or let the script do it): `CREATE DATABASE employee_management;`
   - Import the `database/schema.sql` file into your MySQL server to set up the tables and insert sample data.
   
3. **Configuration**:
   - Open `config/database.php`.
   - Update the `$username` (default is `root`) and `$password` (default `''`) if your local MySQL uses different credentials.

## How to Run

1. Open your browser and navigate to `http://localhost/employee_system`.
2. Login with the following sample credentials:

   **Admin Login:**
   - Username: `admin`
   - Password: `password123`
   
   **Manager Login (HR Department):**
   - Username: `manager1`
   - Password: `password123`
   
   **Employee Login (IT Department):**
   - Username: `employee1`
   - Password: `password123`
   
   **Employee Login (Sales Department):**
   - Username: `employee2`
   - Password: `password123`
   
3. Explore the dashboards based on roles!

## Security Notes
In this project, passwords are created using PHP's `password_hash()` function with default BCRYPT configuration, ensuring that plain texts are never saved directly to the database. The system prevents SQL Injections primarily via `mysqli_real_escape_string()` combined with parameterized variables `bind_param()` on critical insertion and updates. 
