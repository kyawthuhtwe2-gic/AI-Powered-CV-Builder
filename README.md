# AI-Powered CV Builder

Lightweight web app that helps users build curriculum vitae (CV) documents with AI-assisted features.

**Structure**
- `backend/` — Spring Boot API and persistence layer.
- `frontend/` — React + Vite SPA (UI for creating, previewing, and exporting CVs).
- `docker-compose.yml` — optional local deployment for frontend + backend.

**Quick Start (development)**

Prerequisites: Java 17+, Maven, Node 18+, and either `pnpm` or `npm` installed.

1. Start backend (from repo root):

```bash
cd backend
./mvnw package -DskipTests
java -jar target/*.jar
```

2. Start frontend (in a separate terminal):

```bash
cd frontend
npm install
npm run dev
```

3. Open the frontend in your browser (Vite will show the exact URL, commonly `http://localhost:5173`).

Environment variables
- Frontend: set `VITE_API_BASE_URL` to point to the backend (example: `http://localhost:8080`). If unset, the frontend falls back to `localStorage` for persistence.

API
The backend exposes simple CV CRUD endpoints under `/cvs` (see `backend/README.md` for details).

Docker
- Use `docker-compose.yml` to bring up services together. It expects images/builds for both services.

Contributing
- See `backend/` and `frontend/` folders for local development notes. Open an issue or PR for changes.

License
- Check repository root or ask the project owner for the license used.
