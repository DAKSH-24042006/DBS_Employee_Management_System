CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin', 'Manager', 'Employee') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `employees` (
  `emp_id` INT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(50) NOT NULL,
  `designation` VARCHAR(50) NOT NULL,
  `contact_details` VARCHAR(100) NOT NULL,
  `date_of_joining` DATE NOT NULL,
  FOREIGN KEY (`emp_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

CREATE TABLE `attendance` (
  `attendance_id` INT AUTO_INCREMENT PRIMARY KEY,
  `emp_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `check_in_time` TIME NOT NULL,
  `check_out_time` TIME NULL,
  `status` ENUM('Present', 'Absent', 'Half Day', 'Late') DEFAULT 'Present',
  FOREIGN KEY (`emp_id`) REFERENCES `employees`(`emp_id`) ON DELETE CASCADE,
  UNIQUE (`emp_id`, `date`)
);

CREATE TABLE `leaves` (
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

CREATE TABLE `leave_approvals` (
  `approval_id` INT AUTO_INCREMENT PRIMARY KEY,
  `leave_id` INT NOT NULL,
  `approval_status` ENUM('Approved', 'Rejected') NOT NULL,
  `approved_by` INT NOT NULL,
  `approval_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `remarks` TEXT,
  FOREIGN KEY (`leave_id`) REFERENCES `leaves`(`leave_id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Insert Sample Data
-- Passwords are 'password123' hashed with MD5 for simplicity in this PHP Core project, but we'll use password_hash in PHP.
-- Assuming password_hash('password123', PASSWORD_DEFAULT) output format
-- Admin: password123 -> $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO `users` (`user_id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin'),
(2, 'manager1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager'),
(3, 'employee1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Employee'),
(4, 'employee2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Employee');

INSERT INTO `employees` (`emp_id`, `name`, `department`, `designation`, `contact_details`, `date_of_joining`) VALUES
(1, 'System Admin', 'IT Options', 'Administrator', 'admin@example.com', '2020-01-01'),
(2, 'Alice Manager', 'HR', 'HR Manager', 'alice@example.com', '2021-02-15'),
(3, 'Bob Employee', 'IT', 'Software Engineer', 'bob@example.com', '2022-03-10'),
(4, 'Charlie Employee', 'Sales', 'Sales Executive', 'charlie@example.com', '2023-05-20');

INSERT INTO `attendance` (`emp_id`, `date`, `check_in_time`, `check_out_time`, `status`) VALUES
(3, '2026-03-20', '09:00:00', '17:00:00', 'Present'),
(4, '2026-03-20', '09:15:00', '17:30:00', 'Late');

INSERT INTO `leaves` (`leave_id`, `emp_id`, `leave_type`, `start_date`, `end_date`, `reason`, `status`) VALUES
(1, 3, 'Sick', '2026-03-25', '2026-03-26', 'Fever and cold', 'Pending');
