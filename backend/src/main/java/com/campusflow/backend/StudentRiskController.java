
package com.campusflow.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/students")
public class StudentRiskController {

    private final StudentRepository studentRepository;

    public StudentRiskController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping("/risk")
    public List<StudentRisk> getStudentRisks() {
        return studentRepository.findAllByOrderByFullNameAsc()
                .stream()
                .map(this::analyze)
                .toList();
    }

    private StudentRisk analyze(Student student) {
        double attendance = student.getAttendance();
        double assignmentCompletion = student.getAssignmentCompletion();
        double performance = student.getPerformance();

        int score = (int) Math.round(
                attendance * 0.40
                + assignmentCompletion * 0.30
                + performance * 0.30
        );

        String riskLevel;
        if (score < 60) {
            riskLevel = "HIGH";
        } else if (score < 75) {
            riskLevel = "WATCH";
        } else {
            riskLevel = "ON_TRACK";
        }

        List<String> insights = new ArrayList<>();

        if (attendance < 75) {
            insights.add("Attendance needs attention");
        }

        if (assignmentCompletion < 70) {
            insights.add("Assignment completion is low");
        }

        if (performance < 60) {
            insights.add("Academic performance needs attention");
        }

        if (insights.isEmpty()) {
            insights.add("Current indicators look healthy");
        }

        return new StudentRisk(
                student.getId(),
                student.getFullName(),
                student.getDepartment(),
                attendance,
                assignmentCompletion,
                performance,
                score,
                riskLevel,
                insights
        );
    }

    public record StudentRisk(
            Long id,
            String name,
            String department,
            double attendance,
            double assignmentCompletion,
            double performance,
            int healthScore,
            String riskLevel,
            List<String> insights
    ) {}
}
