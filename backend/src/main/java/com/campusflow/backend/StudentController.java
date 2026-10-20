
package com.campusflow.backend;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public record StudentRequest(
            @NotBlank @Size(max = 100) String fullName,
            @NotBlank @Size(max = 100) String department,
            @DecimalMin("0.0") @DecimalMax("100.0") double attendance,
            @DecimalMin("0.0") @DecimalMax("100.0")
            double assignmentCompletion,
            @DecimalMin("0.0") @DecimalMax("100.0")
            double performance
    ) {
    }

    public record StudentResponse(
            Long id,
            String name,
            String department,
            double attendance,
            double assignmentCompletion,
            double performance,
            int healthScore,
            String riskLevel,
            List<String> insights
    ) {
    }

    @GetMapping
    public List<StudentResponse> getStudents(
            @RequestParam(required = false) String department) {

        List<Student> students;

        if (department == null || department.isBlank()) {
            students = studentRepository.findAllByOrderByFullNameAsc();
        } else {
            students = studentRepository
                    .findByDepartmentIgnoreCaseOrderByFullNameAsc(
                            department.trim());
        }

        return students.stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public StudentResponse getStudent(@PathVariable Long id) {
        return toResponse(findStudent(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse createStudent(
            @Valid @RequestBody StudentRequest request) {

        Student student = new Student(
                request.fullName().trim(),
                request.department().trim(),
                request.attendance(),
                request.assignmentCompletion(),
                request.performance()
        );

        return toResponse(studentRepository.save(student));
    }

    @PutMapping("/{id}")
    public StudentResponse updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        Student student = findStudent(id);

        student.setFullName(request.fullName().trim());
        student.setDepartment(request.department().trim());
        student.setAttendance(request.attendance());
        student.setAssignmentCompletion(
                request.assignmentCompletion());
        student.setPerformance(request.performance());

        return toResponse(studentRepository.save(student));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.delete(findStudent(id));
    }

    private Student findStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));
    }

    private StudentResponse toResponse(Student student) {
        int score = (int) Math.round(
                student.getAttendance() * 0.40
                + student.getAssignmentCompletion() * 0.30
                + student.getPerformance() * 0.30
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

        if (student.getAttendance() < 75) {
            insights.add("Attendance needs attention");
        }
        if (student.getAssignmentCompletion() < 70) {
            insights.add("Assignment completion is low");
        }
        if (student.getPerformance() < 60) {
            insights.add("Academic performance needs attention");
        }
        if (insights.isEmpty()) {
            insights.add("Current indicators look healthy");
        }

        return new StudentResponse(
                student.getId(),
                student.getFullName(),
                student.getDepartment(),
                student.getAttendance(),
                student.getAssignmentCompletion(),
                student.getPerformance(),
                score,
                riskLevel,
                insights
        );
    }
}
