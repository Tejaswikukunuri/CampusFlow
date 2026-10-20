
package com.campusflow.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedStudents(StudentRepository studentRepository) {
        return args -> {
            if (studentRepository.count() == 0) {
                studentRepository.saveAll(List.of(
                    new Student(
                        "Aarav Sharma", "Information Technology",
                        92, 90, 88
                    ),
                    new Student(
                        "Diya Reddy", "Information Technology",
                        62, 55, 68
                    ),
                    new Student(
                        "Ishaan Kumar", "Computer Science",
                        74, 80, 72
                    ),
                    new Student(
                        "Meera Patel", "Computer Science",
                        85, 95, 91
                    ),
                    new Student(
                        "Rohan Verma", "Information Technology",
                        48, 40, 52
                    )
                ));

                System.out.println(
                    "CampusFlow: inserted 5 demo students."
                );
            }
        };
    }
}
