package model;

import java.sql.Date;
import java.sql.Time;

public class Attendance {
    private int attendanceId;
    private int empId;
    private Date date;
    private Time checkInTime;
    private Time checkOutTime;
    private String status;

    public Attendance() {}

    public Attendance(int attendanceId, int empId, Date date, Time checkInTime, Time checkOutTime, String status) {
        this.attendanceId = attendanceId;
        this.empId = empId;
        this.date = date;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.status = status;
    }

    // Getters and Setters
    public int getAttendanceId() { return attendanceId; }
    public void setAttendanceId(int attendanceId) { this.attendanceId = attendanceId; }
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public Time getCheckInTime() { return checkInTime; }
    public void setCheckInTime(Time checkInTime) { this.checkInTime = checkInTime; }
    public Time getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(Time checkOutTime) { this.checkOutTime = checkOutTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
