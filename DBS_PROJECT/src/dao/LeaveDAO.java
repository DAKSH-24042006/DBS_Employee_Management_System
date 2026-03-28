package dao;

import db.DBConnection;
import model.Leave;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LeaveDAO {
    public List<Leave> getAllLeaves() {
        List<Leave> list = new ArrayList<>();
        String query = "SELECT * FROM leaves ORDER BY application_date DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                list.add(new Leave(
                    rs.getInt("leave_id"),
                    rs.getInt("emp_id"),
                    rs.getString("leave_type"),
                    rs.getDate("start_date"),
                    rs.getDate("end_date"),
                    rs.getString("reason"),
                    rs.getTimestamp("application_date"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching leaves: " + e.getMessage());
        }
        return list;
    }

    public boolean processLeave(int leaveId, String status, int approvedBy, String remarks) {
        String query = "{CALL ProcessLeave(?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement cstmt = conn.prepareCall(query)) {
            cstmt.setInt(1, leaveId);
            cstmt.setString(2, status);
            cstmt.setInt(3, approvedBy);
            cstmt.setString(4, remarks);
            return cstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error processing leave: " + e.getMessage());
            return false;
        }
    }
}
