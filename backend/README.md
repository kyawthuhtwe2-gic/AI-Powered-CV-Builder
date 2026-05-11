# Backend (Spring Boot)

This folder contains the Spring Boot backend API for the AI-Powered CV Builder.

Build & Run (development)

Requirements: Java 17+, Maven

From the `backend/` folder:

```bash
./mvnw clean package -DskipTests
java -jar target/*.jar
```

Or run during development:

```bash
./mvnw spring-boot:run
```

Configuration
- `src/main/resources/application.yaml` contains configuration (server port, datasource, etc.).

API endpoints
- `GET /cvs` — list CVs
- `GET /cvs/{id}` — get single CV
- `POST /cvs` — create CV
- `PUT /cvs/{id}` — update CV
- `DELETE /cvs/{id}` — delete CV

Packaging & Docker
- The project builds a standard Spring Boot jar under `target/`.
- Use the repository `docker-compose.yml` to build and run both services together.

Tests
- Run `./mvnw test` to execute unit and integration tests.
