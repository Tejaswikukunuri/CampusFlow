# CampusFlow Architecture

## Overview
CampusFlow is a full-stack academic monitoring application. The React frontend communicates with a Spring Boot REST API, which uses Spring Data JPA to access PostgreSQL.

## Main components
- Frontend: React, TypeScript, Vite and Tailwind CSS.
- Backend: Java 17, Spring Boot, Spring Security and Spring Data JPA.
- Database: PostgreSQL.
- Authentication: registration, login and session-based authentication.

## Request flow
1. A user opens the frontend in a browser.
2. The frontend sends HTTP requests to the backend API.
3. Spring Security applies the configured access rules.
4. Controllers validate requests and call repository methods.
5. Spring Data JPA reads or writes PostgreSQL records.
6. The API returns JSON responses to the frontend.

## Academic risk calculation
Health score = attendance × 0.40 + assignment completion × 0.30 + performance × 0.30.

The calculated score is rounded to a whole number:
- HIGH: score below 60.
- WATCH: score from 60 through 74.
- ON_TRACK: score of 75 or above.

## Main backend components
- Student: student persistence entity.
- StudentRepository: student database operations.
- StudentController: student CRUD endpoints.
- StudentRiskController: risk summaries and insights.
- AuthController: registration, login, session and logout endpoints.
- SecurityConfig: request authorization and CORS configuration.
- DataInitializer: initial demonstration data, if the database is empty.

## Security considerations
Student CRUD endpoints require authentication under the current security configuration. The risk summary endpoint is publicly accessible in the current development configuration. Before production deployment, review authorization, CSRF protection, CORS, session cookie settings, error responses and protection of student information.
