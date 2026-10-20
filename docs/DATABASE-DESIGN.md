# CampusFlow Database Design

## Database
CampusFlow uses PostgreSQL. The configured database name for local development is `campusflow`.

## Students
The Student entity represents an academic record. Its known fields are:

| Field | Purpose |
|---|---|
| id | Unique student identifier |
| fullName | Student name |
| department | Department or academic program |
| attendance | Attendance percentage |
| assignmentCompletion | Assignment completion percentage |
| performance | Academic performance percentage |

The numeric academic indicators are expected to be percentages between 0 and 100.

## Users
The application also contains a User entity and UserRepository for account management. Passwords are hashed using the application's configured password encoder.

Consult the actual entity and database configuration for the precise user columns and constraints; this document does not assume unverified column names.

## Relationships
The currently documented student and user entities are separate. Do not assume a relationship between a student record and an account unless one is explicitly implemented in the entity mappings.

## Academic health score
The health score is calculated from attendance (40%), assignment completion (30%) and performance (30%). It is calculated by application code rather than being documented as a stored database column.

## Local setup
1. Start PostgreSQL.
2. Create the `campusflow` database if it does not already exist.
3. Configure the backend connection using the existing local configuration.
4. Keep credentials out of source control.
5. Start the backend and verify the health endpoint.

## Data safety
Use fictional student records for demonstrations. Back up important records before changing the database schema or removing data.
