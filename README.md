# CampusFlow
### Academic Risk & Student Success Platform

CampusFlow is a full-stack web application designed to help monitor student academic indicators, identify students who may need additional support, and provide insights through a centralized dashboard.

## Features

- **Student Management:** Create, view, update, and delete student records.
- **Academic Risk Assessment:** Calculate a student health score using attendance, assignment completion, and academic performance.
- **Risk Classification:** Categorize students as `HIGH`, `WATCH`, or `ON_TRACK` based on defined scoring rules.
- **Explainable Insights:** Display indicators that may require attention, such as low attendance or assignment completion.
- **Search and Filtering:** Find students and filter records by department or risk status.
- **Analytics Dashboard:** Review student metrics and compare academic indicators.

## Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS / Tailwind utility classes

**Backend**
- Java 17
- Spring Boot
- Spring Data JPA
- Maven

**Database**
- PostgreSQL

## Risk Assessment Logic

CampusFlow calculates the health score using a weighted formula:

`Health Score = (Attendance × 0.40) + (Assignment Completion × 0.30) + (Performance × 0.30)`

The resulting score is classified as:

- **HIGH:** Score below 60
- **WATCH:** Score from 60 to 74
- **ON_TRACK:** Score of 75 or above

Additional insights are generated from individual academic indicators. These scores are intended to support review and intervention, not to make definitive judgments about students.

## Getting Started

### Prerequisites

- Java 17 or compatible configured JDK
- Node.js and npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CampusFlow
```

Replace the placeholder with your actual repository URL after publishing the project.

### 2. Configure PostgreSQL

Create a PostgreSQL database named `campusflow` and configure the database connection in `backend/src/main/resources/application.properties`.

Keep database passwords and other secrets out of version control.

### 3. Start the backend

Open a terminal:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 4. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | Retrieve student records |
| GET | `/api/students/{id}` | Retrieve a student by ID |
| POST | `/api/students` | Create a student record |
| PUT | `/api/students/{id}` | Update a student record |
| DELETE | `/api/students/{id}` | Delete a student record |
| GET | `/api/students/risk` | Retrieve academic risk assessments |

## Testing

Run the backend tests:

```powershell
cd backend
.\mvnw.cmd test
```

## Project Goal

CampusFlow demonstrates full-stack development, REST API design, relational database integration, student record management, and explainable rule-based academic risk assessment.

