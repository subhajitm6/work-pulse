# WorkPulse — Full-Stack Productivity Platform

WorkPulse is a work management and productivity dashboard built with React (Vite + Tailwind CSS + Framer Motion) on the frontend and FastAPI + PostgreSQL on the backend.

---

## 1. Prerequisites

- **Python 3.10+** (Python 3.14+ installed on system)
- **Node.js 18+** & npm
- **PostgreSQL 15+** (PostgreSQL 18 is configured in `pgdata` on port `5433`)

---

## 2. Project Architecture

```
WorkPulse/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py          # /api/auth (register, login, me, verify, reset)
│   │   │   │   ├── workspaces.py    # /api/workspaces (CRUD, default workspace lock)
│   │   │   │   ├── tasks.py         # /api/tasks (CRUD, scoped to workspace)
│   │   │   │   ├── projects.py      # /api/projects (CRUD, scoped to workspace)
│   │   │   │   ├── daily_logs.py    # /api/daily-logs (CRUD with linked tasks)
│   │   │   │   └── analytics.py     # /api/dashboard/summary & /api/analytics/summary
│   │   │   └── deps.py              # JWT Auth & Workspace header injection
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic Settings (.env)
│   │   │   └── security.py          # Argon2 hashing & PyJWT tokens
│   │   ├── db/
│   │   │   └── session.py           # Synchronous SQLAlchemy 2.x session engine
│   │   ├── models/
│   │   │   └── models.py            # PostgreSQL User, Workspace, Project, Task, DailyLog, Activity
│   │   ├── schemas/
│   │   │   └── schemas.py           # Pydantic v2 schemas
│   │   └── main.py                  # FastAPI application with CORS & health endpoint
│   ├── tests/
│   │   └── test_api.py              # Pytest automated test suite
│   ├── seed.py                      # Database demo seeder (Alex Vance & initial sample data)
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment configuration
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── lib/api.js               # Centralized API client with JWT & workspace headers
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Backend JWT session with graceful local fallback
│   │   │   └── AppContext.jsx       # Scoped state synchronized with backend API
│   │   └── ...                      # UI components & pages
└── pgdata/                          # Dedicated PostgreSQL database cluster
```

---

## 3. Running the Complete Application Locally

Open two separate **Windows PowerShell** terminal windows:

### Terminal 1: Start PostgreSQL and the FastAPI Backend

```powershell
# 1. Start dedicated PostgreSQL cluster (port 5433)
& "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D "e:\myworld\WorkPulse\backend\pgdata" -o "-p 5433" -l "e:\myworld\WorkPulse\backend\pgdata\server.log" start

# 2. (In a new tab/window) Start FastAPI backend
cd e:\myworld\WorkPulse\backend
.\venv\Scripts\python run.py
```

*The API will be live at `http://127.0.0.1:8000`. Interactive Swagger docs available at `http://127.0.0.1:8000/docs`.*

### Terminal 2: Start the React Frontend

```powershell
cd e:\myworld\WorkPulse\frontend
npm run dev
```

*The frontend will be live at `http://localhost:5173`.*

---

## 4. Default Demo Account Credentials

- **Email**: `alex@workpulse.app`
- **Password**: `Password123`

You can also use the **Register** page to create any new account with its own independent workspaces and records.

---

## 5. Automated Tests

Run backend pytest suite:

```powershell
cd e:\myworld\WorkPulse\backend
.\venv\Scripts\python -m pytest tests/
```

