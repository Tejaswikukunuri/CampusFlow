# CampusFlow — Student Academic Dashboard

CampusFlow is a student academic monitoring dashboard built to help educators track student performance and identify students who may need additional academic support.

## Features

- Academic overview and student risk monitoring
- Risk classifications: HIGH, WATCH, and ON_TRACK
- Student record management
- Search and filtering
- Academic insights
- CSV export
- Session-based authentication for protected student operations

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS 4
- **Backend:** Java 17, Spring Boot
- **Database:** PostgreSQL
- **Build tools:** npm and Maven
- **Version control:** Git

## Prerequisites

Install Java 17, Node.js with npm, PostgreSQL, and Git.

## Database Configuration

Create a PostgreSQL database named `campusflow`.

Configure these environment variables in the PowerShell session used to start the backend:

- `DB_URL` — defaults to `jdbc:postgresql://localhost:5432/campusflow`
- `DB_USERNAME` — defaults to `postgres`
- `DB_PASSWORD` — your PostgreSQL password

Never commit real passwords or credentials to Git.

## Run the Backend

From the project root:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend health endpoint: http://localhost:8080/api/health

Student risk endpoint: http://localhost:8080/api/students/risk

## Run the Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:5173/.

## Run Tests

Backend tests:

```powershell
cd backend
.\mvnw.cmd test
```

Frontend production build:

```powershell
cd frontend
npm run build
```

## Academic Health Score

The current scoring model combines three indicators:

- Attendance: 40%
- Assignment completion: 30%
- Performance: 30%

Formula:

`Health Score = Attendance × 0.40 + Assignment Completion × 0.30 + Performance × 0.30`

The score is rounded to the nearest whole number.

| Score | Classification |
|---|---|
| Below 60 | HIGH |
| 60 to below 75 | WATCH |
| 75 and above | ON_TRACK |

These classifications are indicators for academic support, not substitutes for educator judgment.

## Security

- Keep database credentials outside version control.
- Review authentication and authorization before deployment.
- Do not publish secrets, passwords, or private configuration.

## Project Status

CampusFlow is an academic dashboard project under development.
