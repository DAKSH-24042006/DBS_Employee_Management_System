package dao;

import db.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReportDAO {
    public List<String> getJoinReport() {
        List<String> list = new ArrayList<>();
        String query = "SELECT e.name, a.date, a.status FROM employees e JOIN attendance a ON e.emp_id = a.emp_id";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                list.add(String.format("%s | %s | %s", rs.getString("name"), rs.getDate("date"), rs.getString("status")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<String> getGroupByReport() {
        List<String> list = new ArrayList<>();
        String query = "SELECT department, COUNT(*) as emp_count FROM employees GROUP BY department";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                list.add(String.format("%s: %d employees", rs.getString("department"), rs.getInt("emp_count")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<String> getNestedReport() {
        List<String> list = new ArrayList<>();
        String query = "SELECT name FROM employees WHERE emp_id IN (SELECT emp_id FROM leaves GROUP BY emp_id HAVING COUNT(*) > 2)";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                list.add(rs.getString("name"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (list.isEmpty()) list.add("No records found");
        return list;
    }
}
