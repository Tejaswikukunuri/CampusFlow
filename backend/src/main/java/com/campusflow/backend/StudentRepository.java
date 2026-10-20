
package com.campusflow.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findAllByOrderByFullNameAsc();

    List<Student> findByDepartmentIgnoreCaseOrderByFullNameAsc(
            String department);
}
