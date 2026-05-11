
  # Frontend (Import from text file)

  This frontend is a Vite + React application used to build and preview CVs. It includes an import-from-text feature and AI-assisted UI components.

  ## Running the app (development)

  Install dependencies and start the dev server:

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

  The dev server (Vite) will print the local URL (commonly `http://localhost:3000`).

  ## Build for production

  ```bash
  npm run build
  npm run preview
  ```

  ## Backend integration (optional)

  - Environment variable: set `VITE_API_BASE_URL` to your backend base URL (example: `http://localhost:8080`).
  - When `VITE_API_BASE_URL` is set the app will call these endpoints:
    - `GET /cvs` — list CVs
    - `GET /cvs/:id` — get single CV
    - `POST /cvs` — create CV
    - `PUT /cvs/:id` — update CV
    - `DELETE /cvs/:id` — delete CV
  - If the backend is unavailable or `VITE_API_BASE_URL` is not set, the app falls back to `localStorage` for storage.

  ## Environment variables
  - `VITE_API_BASE_URL` — optional backend base URL

  ## Notes
  - The frontend uses Vite, React, and TypeScript. See `package.json` for available scripts.

  