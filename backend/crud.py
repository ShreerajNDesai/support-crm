"""
CRUD operations — all database reads and writes live here.
Keeps the router layer thin (validation + HTTP) and the DB logic reusable.
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_

from models import Ticket, Note
from schemas import TicketCreate, TicketUpdate
from utils import generate_ticket_id, classify_ticket


def create_ticket(db: Session, payload: TicketCreate) -> Ticket:
    """Insert a new ticket row with auto-categorization and return the ORM instance."""
    ticket_id = generate_ticket_id(db)
    category = classify_ticket(payload.subject, payload.description)
    ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        subject=payload.subject,
        description=payload.description,
        category=category,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def list_tickets(
    db: Session,
    status: str | None = None,
    search: str | None = None,
) -> list[Ticket]:
    """
    Return tickets filtered by optional status and/or search term.
    Search is case-insensitive partial match across multiple fields.
    Results sorted by created_at DESC (newest first).
    """
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.customer_name.ilike(pattern),
                Ticket.ticket_id.ilike(pattern),
                Ticket.customer_email.ilike(pattern),
                Ticket.subject.ilike(pattern),
                Ticket.description.ilike(pattern),
            )
        )

    return query.order_by(Ticket.created_at.desc()).all()


def get_ticket(db: Session, ticket_id: str) -> Ticket | None:
    """Fetch a single ticket by its ticket_id (e.g. TKT-001). Returns None if not found."""
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def update_ticket(db: Session, ticket: Ticket, payload: TicketUpdate) -> Ticket:
    """
    Update a ticket's status and/or append a note.
    The updated_at timestamp is handled automatically by the ORM onupdate hook.
    """
    if payload.status is not None:
        ticket.status = payload.status

    if payload.notes is not None:
        note = Note(
            ticket_id=ticket.ticket_id,
            note_text=payload.notes,
        )
        db.add(note)

    # Manually set updated_at since onupdate only fires when the row's own columns change,
    # and adding a note alone wouldn't trigger it
    ticket.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ticket)
    return ticket
