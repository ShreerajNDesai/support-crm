"""
Database configuration — SQLAlchemy engine, session factory, and base class.
Uses SQLite file-based DB (crm.db) stored at the path from DATABASE_URL env var.
"""

import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

# Default to a local crm.db file; override via env var for deployment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crm.db")

# Ensure parent directory exists for SQLite database file if a directory is specified
if DATABASE_URL.startswith("sqlite:////"):
    _db_file = DATABASE_URL.replace("sqlite:////", "/")
    _db_dir = os.path.dirname(_db_file)
    if _db_dir:
        os.makedirs(_db_dir, exist_ok=True)
elif DATABASE_URL.startswith("sqlite:///"):
    _db_file = DATABASE_URL.replace("sqlite:///", "")
    _db_dir = os.path.dirname(_db_file)
    if _db_dir:
        os.makedirs(_db_dir, exist_ok=True)

# connect_args needed for SQLite to allow multi-threaded access in FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


# Enable SQLite foreign key enforcement (OFF by default in SQLite)
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and ensures cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
