# CampusFlow — Academic Risk & Student Success Platform

CampusFlow is a web-based academic monitoring dashboard designed to help educators identify students who may need additional academic support.

## Features

* Dashboard showing student academic health metrics.
* Weighted academic health score based on attendance, assignment completion, and performance.
* Risk categories: High Risk, Watch, and On Track.
* Insights highlighting areas that may need attention.
* React frontend integrated with a Spring Boot REST API.

## Technology Stack

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS

**Backend**

* Java
* Spring Boot
* Maven
* REST API

**Database configuration**

* PostgreSQL connection configuration is included.
* The current risk dashboard uses sample student data returned by the backend.

## How Risk Scores Work

The academic health score is calculated using these weights:

| Metric                | Weight |
| --------------------- | -----: |
| Attendance            |    40% |
| Assignment completion |    30% |
| Academic performance  |    30% |

Risk categories:

* **High Risk:** Score below 60
* **Watch:** Score from 60 to below 75
* **On Track:** Score of 75 or higher

These thresholds are rule-based and are intended for demonstration, not as a definitive assessment of a student's academic future.

## Prerequisites

* Java 17 or a compatible configured JDK
* Node.js and npm
* PostgreSQL, if using the configured database connection

## Run the Backend

Open a terminal in the `backend` directory.

Set your local PostgreSQL password for the current PowerShell session:

```powershell
$env:DB_PASSWORD = "YOUR_LOCAL_POSTGRES_PASSWORD"
```

Replace the placeholder with your own local database password. Do not commit passwords to GitHub.

Start Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

Health check: `http://localhost:8080/api/health`

Student risk API: `http://localhost:8080/api/students/risk`

## Run the Frontend

Open a separate terminal in the `frontend` directory.

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open `http://localhost:5173` in your browser.

## Current Project Status

CampusFlow is a working academic-risk dashboard prototype. The student records currently displayed by the risk API are sample data. Database-backed student management, authentication, and production deployment are not claimed as implemented features.

## Future Improvements

* Store and manage student records in PostgreSQL.
* Add secure authentication and role-based access.
* Add CSV import for academic data.
* Add historical performance trends and reports.
* Expand automated tests and deployment configuration.

## Disclaimer

CampusFlow is an educational software project. Its risk scores are rule-based indicators intended to support review, not replace professional judgment.
