package dao;

import db.DBConnection;
import model.Attendance;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AttendanceDAO {
    public List<Attendance> getAllAttendance() {
        List<Attendance> list = new ArrayList<>();
        String query = "SELECT * FROM attendance ORDER BY date DESC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                list.add(new Attendance(
                    rs.getInt("attendance_id"),
                    rs.getInt("emp_id"),
                    rs.getDate("date"),
                    rs.getTime("check_in_time"),
                    rs.getTime("check_out_time"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean markAttendance(int empId, Date date, Time checkIn, String status) {
        String query = "{CALL MarkAttendance(?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement cstmt = conn.prepareCall(query)) {
            cstmt.setInt(1, empId);
            cstmt.setDate(2, date);
            cstmt.setTime(3, checkIn);
            cstmt.setString(4, status);
            cstmt.execute();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
