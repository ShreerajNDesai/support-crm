"""
Pydantic schemas for request validation and response serialization.
Each endpoint has its own explicit input/output schema — no leaky ORM objects.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ── Request Schemas ──────────────────────────────────────────────

class TicketCreate(BaseModel):
    """POST /api/tickets — create a new ticket."""
    customer_name: str = Field(..., min_length=1, max_length=200)
    customer_email: EmailStr
    subject: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = None


class TicketUpdate(BaseModel):
    """PUT /api/tickets/{ticket_id} — update status and/or add a note."""
    status: Optional[str] = Field(
        None, pattern=r"^(Open|In Progress|Closed)$"
    )
    notes: Optional[str] = None  # If present, appended as a new Note row


# ── Response Schemas ─────────────────────────────────────────────

class TicketCreateResponse(BaseModel):
    """Returned after successfully creating a ticket."""
    ticket_id: str
    status: str = "Open"
    category: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class TicketListItem(BaseModel):
    """Single item in the GET /api/tickets list response."""
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    category: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class NoteOut(BaseModel):
    """A single note within a ticket detail response."""
    note_text: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TicketDetailResponse(BaseModel):
    """Full ticket detail returned by GET /api/tickets/{ticket_id}."""
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: Optional[str] = None
    status: str
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    notes: list[NoteOut] = []

    model_config = {"from_attributes": True}


class TicketUpdateResponse(BaseModel):
    """Returned after a successful PUT."""
    success: bool = True
    updated_at: datetime

    model_config = {"from_attributes": True}


class HealthResponse(BaseModel):
    """GET /health — Railway health check."""
    status: str = "ok"
