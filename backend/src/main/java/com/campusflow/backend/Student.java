
package com.campusflow.backend;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String fullName;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String department;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Column(nullable = false)
    private double attendance;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Column(nullable = false)
    private double assignmentCompletion;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Column(nullable = false)
    private double performance;

    protected Student() {
    }

    public Student(
            String fullName,
            String department,
            double attendance,
            double assignmentCompletion,
            double performance) {
        this.fullName = fullName;
        this.department = department;
        this.attendance = attendance;
        this.assignmentCompletion = assignmentCompletion;
        this.performance = performance;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDepartment() {
        return department;
    }

    public double getAttendance() {
        return attendance;
    }

    public double getAssignmentCompletion() {
        return assignmentCompletion;
    }

    public double getPerformance() {
        return performance;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setAttendance(double attendance) {
        this.attendance = attendance;
    }

    public void setAssignmentCompletion(double assignmentCompletion) {
        this.assignmentCompletion = assignmentCompletion;
    }

    public void setPerformance(double performance) {
        this.performance = performance;
    }
}
