CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin', 'Manager', 'Employee') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `employees` (
  `emp_id` INT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(50) NOT NULL,
  `designation` VARCHAR(50) NOT NULL,
  `contact_details` VARCHAR(100) NOT NULL,
  `date_of_joining` DATE NOT NULL,
  FOREIGN KEY (`emp_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `attendance` (
  `attendance_id` INT AUTO_INCREMENT PRIMARY KEY,
  `emp_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `check_in_time` TIME NOT NULL,
  `check_out_time` TIME NULL,
  `status` ENUM('Present', 'Absent', 'Half Day', 'Late') DEFAULT 'Present',
  FOREIGN KEY (`emp_id`) REFERENCES `employees`(`emp_id`) ON DELETE CASCADE,
  UNIQUE (`emp_id`, `date`)
);

CREATE TABLE IF NOT EXISTS `leaves` (
  `leave_id` INT AUTO_INCREMENT PRIMARY KEY,
  `emp_id` INT NOT NULL,
  `leave_type` ENUM('Casual', 'Sick', 'Earned') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `reason` TEXT NOT NULL,
  `application_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  FOREIGN KEY (`emp_id`) REFERENCES `employees`(`emp_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `leave_approvals` (
  `approval_id` INT AUTO_INCREMENT PRIMARY KEY,
  `leave_id` INT NOT NULL,
  `approval_status` ENUM('Approved', 'Rejected') NOT NULL,
  `approved_by` INT NOT NULL,
  `approval_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `remarks` TEXT,
  FOREIGN KEY (`leave_id`) REFERENCES `leaves`(`leave_id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `audit_log` (
  `log_id` INT AUTO_INCREMENT PRIMARY KEY,
  `table_name` VARCHAR(50),
  `action` VARCHAR(50),
  `record_id` INT,
  `old_value` TEXT,
  `new_value` TEXT,
  `changed_by` VARCHAR(50),
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO `users` (`user_id`, `username`, `password`, `role`) VALUES
(1, 'admin', 'password123', 'Admin'),
(2, 'manager1', 'password123', 'Manager'),
(3, 'employee1', 'password123', 'Employee');

INSERT IGNORE INTO `employees` (`emp_id`, `name`, `department`, `designation`, `contact_details`, `date_of_joining`) VALUES
(1, 'System Admin', 'IT', 'Administrator', 'admin@example.com', '2020-01-01'),
(2, 'Alice Manager', 'HR', 'HR Manager', 'alice@example.com', '2021-02-15'),
(3, 'Bob Employee', 'IT', 'Software Engineer', 'bob@example.com', '2022-03-10');
