# Support CRM — Customer Support Ticketing System

A full-stack Customer Support CRM built for the **Datastraw Technologies** hiring assessment. The application lets support teams create, search, filter, and manage customer support tickets with an internal notes timeline and AI-powered auto-categorization.

**Live Demo:**
- Frontend: [https://support-crm-two-neon.vercel.app/](https://support-crm-two-neon.vercel.app/)
- Backend API: [https://support-crm-production-78cc.up.railway.app](https://support-crm-production-78cc.up.railway.app)
- API Docs (Swagger): [https://support-crm-production-78cc.up.railway.app/docs](https://support-crm-production-78cc.up.railway.app/docs)

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Backend    | Python 3.11, FastAPI, SQLAlchemy ORM, Pydantic v2   |
| Database   | SQLite (file-based, `crm.db`)                       |
| Frontend   | React 18, Vite, Tailwind CSS, React Router v6       |
| API Client | Plain `fetch` with `useState` / `useEffect`         |
| Server     | Uvicorn                                             |
| Deployment | Backend → Railway, Frontend → Vercel                |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vercel)                       │
│                                                                 │
│   React 18 + Vite + Tailwind CSS                                │
│   ┌──────────┐  ┌───────────────┐  ┌──────────────────┐         │
│   │ HomePage │  │CreateTicketPg │  │ TicketDetailPage │         │
│   │ (list,   │  │ (form +       │  │ (detail, status  │         │
│   │  search, │  │  validation)  │  │  update, notes)  │         │
│   │  filter) │  └───────────────┘  └──────────────────┘         │
│   └──────────┘                                                  │
│         │            api/client.js (fetch wrapper)              │
│         │            VITE_API_URL env var                       │
└─────────┼───────────────────────────────────────────────────────┘
          │  HTTPS (CORS enabled)
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND (Railway)                         │
│                                                                 │
│   FastAPI + Uvicorn                                             │
│   ┌──────────────────────────────────────────────────┐          │
│   │ routers/tickets.py                               │          │
│   │  POST   /api/tickets          → create ticket    │          │
│   │  GET    /api/tickets          → list + search    │          │
│   │  GET    /api/tickets/{id}     → detail + notes   │          │
│   │  PUT    /api/tickets/{id}     → update + note    │          │
│   │  GET    /health               → health check     │          │
│   └──────────────────────────────────────────────────┘          │
│         │                                                       │
│   ┌─────┴─────┐  ┌───────────┐  ┌────────────────┐              │
│   │  crud.py  │  │ schemas.py│  │   utils.py     │              │
│   │  (DB ops) │  │ (Pydantic)│  │ (ticket_id gen,│              │
│   └─────┬─────┘  └───────────┘  │  categorizer)  │              │
│         │                       └────────────────┘              │
│         ▼                                                       │
│   ┌───────────────────────┐                                     │
│   │  SQLite (crm.db)      │ ← Persistent Volume (/data)         │
│   │  ┌────────┐ ┌───────┐ │                                     │
│   │  │tickets │ │ notes │ │                                     │
│   │  └────────┘ └───────┘ │                                     │
│   └───────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
support-crm/
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router mounting
│   ├── database.py             # SQLAlchemy engine + session
│   ├── models.py               # Ticket, Note ORM models
│   ├── schemas.py              # Pydantic request/response models
│   ├── crud.py                 # DB operations (create, list, get, update)
│   ├── utils.py                # ticket_id generator, auto-categorizer
│   ├── routers/
│   │   └── tickets.py          # All /api/tickets endpoints
│   ├── Dockerfile              # Docker build for Railway
│   ├── Procfile                # Process declaration for Railway
│   ├── railway.json            # Railway deployment config
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variable template
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # React DOM entry point
│   │   ├── App.jsx             # Layout + routes
│   │   ├── index.css           # Tailwind + custom styles
│   │   ├── api/
│   │   │   └── client.js       # fetch wrapper, base URL from env
│   │   ├── components/
│   │   │   ├── TicketList.jsx       # Ticket card list with states
│   │   │   ├── TicketRow.jsx        # Single ticket card
│   │   │   ├── TicketDetail.jsx     # Full detail + status update
│   │   │   ├── CreateTicketForm.jsx # Validated creation form
│   │   │   ├── SearchBar.jsx        # Debounced search (300ms)
│   │   │   ├── StatusFilter.jsx     # Status dropdown filter
│   │   │   ├── StatusBadge.jsx      # Color-coded status pill
│   │   │   ├── CategoryBadge.jsx    # AI category badge
│   │   │   └── NoteList.jsx         # Notes activity timeline
│   │   └── pages/
│   │       ├── HomePage.jsx         # Dashboard with metrics
│   │       ├── CreateTicketPage.jsx # New ticket form page
│   │       └── TicketDetailPage.jsx # Ticket inspection page
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json             # SPA rewrite rules for Vercel
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── README.md
└── .gitignore
```

---

## Database Schema

### `tickets` table

| Column           | Type     | Constraints                                      |
|------------------|----------|--------------------------------------------------|
| `id`             | INTEGER  | PRIMARY KEY, AUTOINCREMENT                       |
| `ticket_id`      | TEXT     | UNIQUE, NOT NULL (format: `TKT-001`)             |
| `customer_name`  | TEXT     | NOT NULL                                         |
| `customer_email` | TEXT     | NOT NULL                                         |
| `subject`        | TEXT     | NOT NULL                                         |
| `description`    | TEXT     | nullable                                         |
| `status`         | TEXT     | NOT NULL, DEFAULT `'Open'`, CHECK constraint     |
| `category`       | TEXT     | nullable, DEFAULT `'Other'` (auto-classified)    |
| `created_at`     | DATETIME | DEFAULT current UTC time                         |
| `updated_at`     | DATETIME | DEFAULT current UTC time, auto-updates on change |

### `notes` table

| Column       | Type     | Constraints                                              |
|--------------|----------|----------------------------------------------------------|
| `id`         | INTEGER  | PRIMARY KEY, AUTOINCREMENT                               |
| `ticket_id`  | TEXT     | FOREIGN KEY → `tickets.ticket_id`, ON DELETE CASCADE     |
| `note_text`  | TEXT     | NOT NULL                                                 |
| `created_at` | DATETIME | DEFAULT current UTC time                                 |

**Relationship:** One ticket has many notes. Deleting a ticket cascades to delete all its notes.

---

## API Documentation

### `POST /api/tickets` — Create a new ticket

**Request Body:**
```json
{
  "customer_name": "Alice Chen",
  "customer_email": "alice@example.com",
  "subject": "Cannot reset password",
  "description": "Tried 3 times, no email received"
}
```

**Response (`201 Created`):**
```json
{
  "ticket_id": "TKT-001",
  "status": "Open",
  "category": "Technical",
  "created_at": "2026-09-19T08:30:00.000000"
}
```

**Validation:** Email must be valid format. `customer_name` and `subject` are required (min 1 char). Returns `422` on validation failure.

---

### `GET /api/tickets` — List tickets

**Query Parameters (all optional):**
| Param    | Description                                                        |
|----------|--------------------------------------------------------------------|
| `status` | Filter by status: `Open`, `In Progress`, `Closed`                 |
| `search` | Case-insensitive partial match on name, email, subject, ticket_id  |

**Example:** `GET /api/tickets?status=Open&search=password`

**Response (`200 OK`):**
```json
[
  {
    "ticket_id": "TKT-001",
    "customer_name": "Alice Chen",
    "subject": "Cannot reset password",
    "status": "Open",
    "category": "Technical",
    "created_at": "2026-09-19T08:30:00.000000"
  }
]
```

Sorted by `created_at` DESC (newest first).

---

### `GET /api/tickets/{ticket_id}` — Get ticket detail

**Response (`200 OK`):**
```json
{
  "ticket_id": "TKT-001",
  "customer_name": "Alice Chen",
  "customer_email": "alice@example.com",
  "subject": "Cannot reset password",
  "description": "Tried 3 times, no email received",
  "status": "Open",
  "category": "Technical",
  "created_at": "2026-09-19T08:30:00.000000",
  "updated_at": "2026-09-19T08:30:00.000000",
  "notes": [
    {
      "note_text": "Checked SendGrid logs, emails are bouncing",
      "created_at": "2026-09-19T09:00:00.000000"
    }
  ]
}
```

Returns `404` if ticket not found.

---

### `PUT /api/tickets/{ticket_id}` — Update ticket

**Request Body (both fields optional):**
```json
{
  "status": "In Progress",
  "notes": "Investigating the issue with the email provider"
}
```

If `status` is provided, updates the ticket status. If `notes` is provided, appends a new Note row. `updated_at` is automatically refreshed.

**Response (`200 OK`):**
```json
{
  "success": true,
  "updated_at": "2026-09-19T10:15:00.000000"
}
```

Returns `404` if ticket not found. Status must be one of: `Open`, `In Progress`, `Closed`.

---

### `GET /health` — Health check

**Response:** `{ "status": "ok" }`

Used by Railway for automated health monitoring.

---

## Stand-Out Feature: AI Auto-Categorization

On ticket creation, the system automatically classifies each ticket into one of five categories based on the subject and description content:

| Category          | Trigger Keywords                                        |
|-------------------|---------------------------------------------------------|
| **Technical**     | bug, error, crash, server, API, timeout, 500, 404       |
| **Billing**       | invoice, payment, refund, charge, subscription, pricing |
| **Account**       | password, login, account, locked, 2FA, SSO, profile     |
| **Feature Request**| feature, request, add, integrate, support for, wishlist |
| **Other**         | Default when no keywords match                          |

The category appears as a color-coded badge on both the ticket list and detail views.

### Why this matters

Real support teams triage hundreds of tickets daily. Auto-categorization reduces manual sorting and helps agents prioritize their queue. **Tradeoff:** keyword matching is fast and free but less accurate than an LLM call — which I'd swap in for production by replacing the `classify_ticket()` function in `utils.py` with an API call to OpenAI or a similar service. The function signature stays the same, so the rest of the codebase wouldn't need any changes.

---

## Local Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/ShreerajNDesai/support-crm.git
cd support-crm
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Start the development server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at `http://localhost:8000` and Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment

### Backend → Railway

1. Create a new project on [Railway.app](https://railway.app) and connect your GitHub repo.
2. Set the **Root Directory** to `backend`.
3. Add a **Persistent Volume** with mount path `/data`.
4. Set environment variables:
   - `DATABASE_URL` = `sqlite:////data/crm.db`
   - `CORS_ORIGINS` = `https://your-frontend.vercel.app`
5. Railway auto-detects the `Dockerfile` and deploys. The `/health` endpoint is used for health checks.

### Frontend → Vercel

1. Import the GitHub repo on [Vercel.com](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.up.railway.app` (include `https://`, no trailing slash)
4. Deploy. The `vercel.json` rewrite rule handles SPA client-side routing.

---

## Tradeoffs & Decisions

| Decision | Reasoning |
|----------|-----------|
| **SQLite over PostgreSQL** | Assessment specified SQLite. Zero configuration, single-file database, perfect for a contained demo. For production scale, I'd switch to PostgreSQL — the only change would be the `DATABASE_URL` connection string and removing `check_same_thread`. |
| **`fetch` over React Query/Axios** | Assessment required plain `useState`/`useEffect`. React Query would add caching, retry logic, and stale-while-revalidate — but adds complexity and a dependency that wasn't requested. |
| **Keyword matching over LLM for categorization** | Fast, free, deterministic, and zero external dependencies. An LLM call (OpenAI, etc.) would be more accurate but adds latency (~500ms), cost per request, and an API key dependency. The `classify_ticket()` function is isolated in `utils.py` so swapping in an LLM call is a one-function change. |
| **Pydantic v2 `model_config` over v1 `class Config`** | Modern Pydantic v2 style using `model_config = {"from_attributes": True}` for ORM-to-schema serialization. More explicit and forward-compatible. |
| **SQLAlchemy `PRAGMA foreign_keys=ON`** | SQLite disables foreign key enforcement by default. Without this pragma, deleting a ticket would leave orphan notes. I added a connection event listener that enables it on every new connection. |
| **Railway persistent volume at `/data`** | Container filesystems are ephemeral — redeploying wipes local files. A persistent volume ensures `crm.db` survives restarts and redeployments. |
| **Debounced search (300ms)** | Prevents flooding the backend with an API call per keystroke. The `useRef` timer pattern avoids stale closures and cancels the previous timeout on each new input. |
| **`vercel.json` SPA rewrite** | Without it, directly navigating to `/tickets/TKT-001` on Vercel returns a 404 because Vercel looks for a physical file. The rewrite sends all routes to `index.html` where React Router handles them client-side. |

---

## Testing

### API Integration Tests

```bash
cd backend
python test_crm_api.py
```

Runs 7 end-to-end tests covering: list, filter, search, create (with auto-categorization), get detail, update status, and add note.

### Frontend Build Verification

```bash
cd frontend
npm run build
```

Produces an optimized production bundle in `dist/` with zero errors.

---

## License

Built for the Datastraw Technologies hiring assessment.
