# Portfolio — React + Express (Assignment 3)

CS1303 Full Stack Development — extending the React portfolio from Assignment 2
with a real Node.js / Express backend that serves project data and handles
contact-form submissions.

## 📽️ Video Demo

[Watch the demo on Google Drive](https://drive.google.com/drive/folders/1jEQu8INFWWU_prbf6m4gkpnkUXmptSR0?usp=drive_link)

---

## Project Structure

```
portfolio-react/          ← repo root
├── client/               ← React frontend (was `src/` in Assignment 2)
│   ├── api/client.js     ← shared fetch helpers (BASE_URL from .env)
│   ├── components/       ← Navbar, Footer, ContactForm, ProjectCard, …
│   ├── context/          ← ThemeContext (light/dark)
│   ├── pages/            ← Home, About, Projects, ProjectDetail, Contact, NotFound
│   ├── index.css
│   └── main.jsx
├── server/               ← Express backend
│   ├── data/
│   │   └── projects.json ← project seed data (source of truth)
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── contact.js    ← POST /api/contact, GET /api/contact
│   │   └── projects.js   ← GET /api/projects, GET /api/projects/:id
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── public/               ← static assets served by Vite
├── index.html
├── vite.config.js
├── .env.example          ← frontend env template
└── package.json
```

---

## Quick Start (two commands)

### 1 — Backend

```bash
cd server
cp .env.example .env      # fill in PORT and CLIENT_ORIGIN (see table below)
npm install
npm run dev               # starts Express with nodemon on http://localhost:5000
```

### 2 — Frontend (new terminal, repo root)

```bash
cp .env.example .env      # fill in VITE_API_URL (see table below)
npm install
npm run dev               # starts Vite dev server on http://localhost:5173
```

Requires **Node.js 18+**. No database needed — data lives in JSON files.

---

## Environment Variables

### Frontend (`/.env`) — based on `/.env.example`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the Express backend (no trailing slash) | `http://localhost:5000` |

### Backend (`/server/.env`) — based on `/server/.env.example`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `CLIENT_ORIGIN` | Allowed CORS origin (React dev server URL) | `http://localhost:5173` |

> **Never commit `.env` files.** They are in `.gitignore`. Only `.env.example` is tracked.

---

## API Reference

Base URL: `http://localhost:5000` (or whatever `PORT` is set to).

### B1 — Health Check

```
GET /
```

**Response 200**
```json
{ "status": "ok" }
```

---

### B2 — List Projects

```
GET /api/projects
```

**Response 200**
```json
[
  {
    "id": "echochamber",
    "title": "EchoChamber",
    "tagline": "Personality-aware chat",
    "description": "...",
    "details": "...",
    "tech": ["Real-time chat", "AI-assisted messaging", "Full stack"],
    "image": "/project-thumb.svg",
    "link": "https://echochamber-gamma.vercel.app/",
    "repo": "https://github.com/sangramreddy24"
  }
]
```

---

### B3 — Get Single Project

```
GET /api/projects/:id
```

**Response 200** — project object (same shape as above)

**Response 404** (unknown id)
```json
{ "error": "Project not found" }
```

---

### B4 — Submit Contact Form

```
POST /api/contact
Content-Type: application/json

{ "name": "Alice", "email": "alice@example.com", "message": "Hello!" }
```

**Response 201**
```json
{
  "message": "Thanks! Your message has been received.",
  "submission": {
    "id": 1789399966866,
    "name": "Alice",
    "email": "alice@example.com",
    "message": "Hello!",
    "submittedAt": "2026-09-14T15:32:46.866Z"
  }
}
```

**Response 400** — missing or invalid field
```json
{ "error": "Email must contain '@' and a valid domain (e.g. user@example.com)" }
```

---

### B5 — List Submissions

```
GET /api/contact
```

**Response 200**
```json
[
  {
    "id": 1789399966866,
    "name": "Alice",
    "email": "alice@example.com",
    "message": "Hello!",
    "submittedAt": "2026-09-14T15:32:46.866Z"
  }
]
```

> **Note:** This endpoint is intentionally unauthenticated for assignment evaluation
> purposes. In a production system it would be protected by an admin auth layer.

---

### B6 — Error Handling

Undefined routes:
```
GET /api/doesnotexist  →  404  { "error": "Cannot GET /api/doesnotexist -- route not found" }
```

Unhandled server errors are caught by global middleware and return a JSON error body
with an appropriate status code. The server never returns raw HTML or crashes.

---

## Storage

- **Projects:** loaded once from `server/data/projects.json` at startup (in-memory).
- **Contact submissions:** persisted to `server/data/submissions.json` on every
  successful POST. `submissions.json` is in `.gitignore` (runtime data); the server
  handles a missing file gracefully on startup.

---

## Postman Collection

A full Postman collection covering all seven backend endpoints (B1–B7), including
at least one failure case per validated endpoint, is included at the repo root:

```
My Collection.postman_collection.json
```

Import it into Postman via **File → Import**.

---

## Component Tree

```
main.jsx
 └─ BrowserRouter
     └─ ThemeProvider              (Context: theme state)
         └─ App                    (defines all <Route>s)
             └─ Layout             (shared shell)
                 ├─ Navbar         (nav links, theme toggle, mobile menu)
                 ├─ <Outlet />     → active page:
                 │    ├─ Home                (simulated load useEffect)
                 │    ├─ About
                 │    │    └─ AboutContent   (bio, skills)
                 │    ├─ Projects            ← fetches GET /api/projects
                 │    │    └─ ProjectCard × n
                 │    ├─ ProjectDetail       ← fetches GET /api/projects/:id
                 │    ├─ Contact
                 │    │    └─ ContactForm    ← POSTs to /api/contact
                 │    └─ NotFound
                 └─ Footer
```

---

## Frontend Integration Notes

- **F1 (Projects fetch):** `Projects.jsx` — `useEffect` fetches `GET /api/projects`;
  loading and error states are shown in the UI.
- **F2 (Error state):** If the backend is unreachable, a visible error message replaces
  the project grid (not a blank page or console-only error).
- **F3 (Project detail):** `ProjectDetail.jsx` — fetches `GET /api/projects/:id` via
  `useParams`. Unknown ids show a "not found" message with a back link; direct deep
  links work without a local data file.
- **F4 (Contact submit):** `ContactForm.jsx` — POSTs to `/api/contact`. Success shows
  a confirmation and resets the form. Server-provided error messages (e.g. bypassing
  client validation via DevTools) are displayed directly to the user.

All Assignment 2 features (theme toggle, routing, 404 page, responsive layout) continue
to work unchanged.

---

## Other Scripts

```bash
# Frontend (repo root):
npm run build     # production build (output → dist/)
npm run preview   # preview the production build
npm run lint      # lint with oxlint

# Backend (server/):
npm start         # production (node server.js)
npm run dev       # development (nodemon, auto-restart)
```

---

## AI Assistance Disclosure

Per the assignment's disclosure requirement: I used Claude (Anthropic / Antigravity IDE)
to help scaffold the Express server structure, route handlers, error middleware, and
frontend `useEffect` data-fetching patterns, and to review edge cases (CORS, gitignore,
missing Content-Type handling). Small debugging snippets were also assisted by the same
tool. I reviewed, tested, and adjusted all generated code myself before submission.


