"""
Ticket router — all /api/tickets endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from schemas import (
    TicketCreate,
    TicketCreateResponse,
    TicketListItem,
    TicketDetailResponse,
    TicketUpdate,
    TicketUpdateResponse,
)
import crud

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


@router.post("", response_model=TicketCreateResponse, status_code=201)
def create_ticket(
    payload: TicketCreate,
    db: Session = Depends(get_db),
):
    """Create a new support ticket. Returns the generated ticket_id and timestamp."""
    try:
        ticket = crud.create_ticket(db, payload)
        return ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create ticket: {str(e)}")


@router.get("", response_model=list[TicketListItem])
def list_tickets(
    status: str | None = Query(None, pattern=r"^(Open|In Progress|Closed)$"),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """List all tickets with optional status filter and search."""
    try:
        return crud.list_tickets(db, status=status, search=search)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tickets: {str(e)}")


@router.get("/{ticket_id}", response_model=TicketDetailResponse)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
):
    """Get full details for a single ticket including notes."""
    ticket = crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return ticket


@router.put("/{ticket_id}", response_model=TicketUpdateResponse)
def update_ticket(
    ticket_id: str,
    payload: TicketUpdate,
    db: Session = Depends(get_db),
):
    """Update a ticket's status and/or add a note."""
    ticket = crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")

    try:
        updated = crud.update_ticket(db, ticket, payload)
        return updated
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update ticket: {str(e)}")
