"""
FastAPI application entry point.
- Loads environment variables
- Configures CORS for the frontend origin
- Creates database tables on startup
- Mounts the ticket router
- Exposes a /health endpoint for Railway
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers.tickets import router as tickets_router
from schemas import HealthResponse

# Load .env file if present (dev only; on Railway, env vars are set directly)
load_dotenv()

app = FastAPI(
    title="Support CRM API",
    description="Customer Support Ticketing System for Datastraw Technologies",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────
# CORS_ORIGINS env var: comma-separated list of allowed origins
# e.g. "http://localhost:5173,https://my-app.vercel.app"
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup: create tables if they don't exist ────────────────────
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# ── Routes ────────────────────────────────────────────────────────
app.include_router(tickets_router)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Railway health check endpoint."""
    return {"status": "ok"}
