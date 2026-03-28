package model;

import java.sql.Date;

public class Employee {
    private int empId;
    private String name;
    private String department;
    private String designation;
    private String contactDetails;
    private Date dateOfJoining;

    public Employee() {}

    public Employee(int empId, String name, String department, String designation, String contactDetails, Date dateOfJoining) {
        this.empId = empId;
        this.name = name;
        this.department = department;
        this.designation = designation;
        this.contactDetails = contactDetails;
        this.dateOfJoining = dateOfJoining;
    }

    // Getters and Setters
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
    public Date getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(Date dateOfJoining) { this.dateOfJoining = dateOfJoining; }
}
