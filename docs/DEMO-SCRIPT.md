# CampusFlow Demonstration Script

## 1. Introduction
"CampusFlow is a student academic monitoring dashboard that combines attendance, assignment completion and academic performance to help identify students who may need academic support."

## 2. Start the application
- Start PostgreSQL.
- Start the backend from the backend directory using `.\mvnw.cmd spring-boot:run`.
- Start the frontend from the frontend directory using `npm run dev`.
- Open the local URL printed by Vite.

## 3. Demonstrate authentication
- Register a test account if needed.
- Sign in.
- Explain that student management endpoints are protected by the backend security configuration.

## 4. Demonstrate the dashboard
- Show the student count and average health score.
- Explain the HIGH, WATCH and ON_TRACK categories.
- Point out the student search and department/risk filters.

## 5. Explain the calculation
The score weights attendance at 40%, assignment completion at 30%, and performance at 30%. Scores below 60 are HIGH, scores from 60 through 74 are WATCH, and scores of 75 or above are ON_TRACK.

## 6. Demonstrate student management
- Add a fictional test student.
- Edit that student's information.
- Delete the test record after the demonstration if it is no longer needed.
- Avoid changing or deleting the original demonstration records.

## 7. Demonstrate export
Use the CSV export feature and explain how the exported records can support further analysis.

## 8. Technical explanation
Describe the React and TypeScript frontend, Spring Boot REST API, Spring Security, Spring Data JPA and PostgreSQL persistence.

## 9. Closing
"CampusFlow demonstrates a full-stack approach to academic monitoring. Its risk categories are decision-support indicators and should be used alongside educators' judgment, not as definitive predictions."

## Before presenting
- Confirm both servers start successfully.
- Test login and logout.
- Test adding and editing a student.
- Verify CSV export.
- Use fictional demonstration data.
- Never display passwords or database credentials.
