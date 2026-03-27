package model;

import java.sql.Date;
import java.sql.Timestamp;

public class Leave {
    private int leaveId;
    private int empId;
    private String leaveType;
    private Date startDate;
    private Date endDate;
    private String reason;
    private Timestamp applicationDate;
    private String status;

    public Leave() {}

    public Leave(int leaveId, int empId, String leaveType, Date startDate, Date endDate, String reason, Timestamp applicationDate, String status) {
        this.leaveId = leaveId;
        this.empId = empId;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.applicationDate = applicationDate;
        this.status = status;
    }

    // Getters and Setters
    public int getLeaveId() { return leaveId; }
    public void setLeaveId(int leaveId) { this.leaveId = leaveId; }
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Timestamp getApplicationDate() { return applicationDate; }
    public void setApplicationDate(Timestamp applicationDate) { this.applicationDate = applicationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
