package dao;

import db.DBConnection;
import model.Employee;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO {
    public List<Employee> getAllEmployees() {
        List<Employee> list = new ArrayList<>();
        String query = "SELECT * FROM employees";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                list.add(new Employee(
                    rs.getInt("emp_id"),
                    rs.getString("name"),
                    rs.getString("department"),
                    rs.getString("designation"),
                    rs.getString("contact_details"),
                    rs.getDate("date_of_joining")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean addEmployee(String username, String password, String role, String name, String dept, String desig, String contact, Date joinDate) {
        String query = "{CALL AddEmployee(?, ?, ?, ?, ?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement cstmt = conn.prepareCall(query)) {
            cstmt.setString(1, username);
            cstmt.setString(2, password);
            cstmt.setString(3, role);
            cstmt.setString(4, name);
            cstmt.setString(5, dept);
            cstmt.setString(6, desig);
            cstmt.setString(7, contact);
            cstmt.setDate(8, joinDate);
            cstmt.execute();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteEmployee(int id) {
        String query = "DELETE FROM users WHERE user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
