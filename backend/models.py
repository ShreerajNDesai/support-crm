"""
SQLAlchemy ORM models for the Ticket and Note tables.
Mirrors the exact schema specified in the assessment requirements.
"""

from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, Text, DateTime, ForeignKey, CheckConstraint
)
from sqlalchemy.orm import relationship
from database import Base


def _utc_now() -> datetime:
    """Return current UTC time — used as a callable default for columns."""
    return datetime.now(timezone.utc)


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Text, unique=True, nullable=False, index=True)
    customer_name = Column(Text, nullable=False)
    customer_email = Column(Text, nullable=False)
    subject = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(
        Text,
        nullable=False,
        default="Open",
    )
    category = Column(Text, nullable=True, default="Other")
    created_at = Column(DateTime, default=_utc_now)
    updated_at = Column(DateTime, default=_utc_now, onupdate=_utc_now)

    # Enforce allowed status values at the DB level
    __table_args__ = (
        CheckConstraint(
            "status IN ('Open', 'In Progress', 'Closed')",
            name="ck_ticket_status",
        ),
    )

    # One ticket → many notes; cascade delete so orphan notes are cleaned up
    notes = relationship(
        "Note",
        back_populates="ticket",
        cascade="all, delete-orphan",
        order_by="Note.created_at.asc()",
    )

    def __repr__(self) -> str:
        return f"<Ticket {self.ticket_id} — {self.status}>"


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(
        Text,
        ForeignKey("tickets.ticket_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    note_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=_utc_now)

    # Back-reference to the parent ticket
    ticket = relationship("Ticket", back_populates="notes")

    def __repr__(self) -> str:
        return f"<Note ticket={self.ticket_id} id={self.id}>"
