"""
Seed script to populate tickets with different statuses and categories.
Usage:
    python seed_data.py          # Seeds missing sample tickets (preserves existing)
    python seed_data.py --reset  # Clears all tickets and reseeds TKT-001 to TKT-006
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import engine, Base, SessionLocal
from models import Ticket, Note
from utils import classify_ticket, generate_ticket_id
from datetime import datetime, timezone
from sqlalchemy import text

# Ensure tables are created with latest models
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # If --reset or --clean is passed, wipe existing tickets & notes
    if "--reset" in sys.argv or "--clean" in sys.argv:
        print("Resetting database: clearing all notes and tickets...")
        db.query(Note).delete()
        db.query(Ticket).delete()
        db.commit()
        try:
            db.execute(text("DELETE FROM sqlite_sequence WHERE name IN ('tickets', 'notes')"))
            db.commit()
        except Exception:
            pass
        print("Existing data cleared.")

    sample_data = [
        {
            "customer_name": "Alice Chen",
            "customer_email": "alice@techcorp.com",
            "subject": "Invoice dispute for March subscription",
            "description": "We were double billed for the enterprise plan renewal on invoice #INV-4091. Please refund the duplicate charge.",
            "status": "Open",
        },
        {
            "customer_name": "Marcus Vance",
            "customer_email": "marcus.v@acmeweb.io",
            "subject": "500 Internal Server Error on checkout webhook",
            "description": "Our webhook endpoint is receiving 500 error responses intermittently when processing Stripe events during checkout.",
            "status": "In Progress",
            "notes": ["Investigating webhook server logs for stack traces.", "Reproduced with high concurrency payloads."]
        },
        {
            "customer_name": "Elena Rostova",
            "customer_email": "elena.r@innovate.co",
            "subject": "Request SSO and SAML integration support",
            "description": "Our security compliance team requires Okta SAML 2.0 single sign-on support before rolling out to 200 users.",
            "status": "Open",
        },
        {
            "customer_name": "David Kim",
            "customer_email": "david.k@cloudsys.net",
            "subject": "Account locked after 3 password reset attempts",
            "description": "User account david.k@cloudsys.net is permanently locked. Password reset token email is not arriving in inbox.",
            "status": "Closed",
            "notes": ["Verified user identity via security questions.", "Reset lock status and issued manual password reset link.", "Customer confirmed successful login."]
        },
        {
            "customer_name": "Sophia Patel",
            "customer_email": "sophia@nexushealth.org",
            "subject": "Feature request: Export analytics report to CSV/PDF",
            "description": "Would love an option in the dashboard to automatically export weekly ticket metrics and resolution times to CSV or PDF.",
            "status": "Open",
        },
        {
            "customer_name": "Carlos Gomez",
            "customer_email": "cgomez@datastream.com",
            "subject": "Refund request for unused seats",
            "description": "We downsized our team by 5 seats last month and would like a pro-rated credit or refund.",
            "status": "In Progress",
            "notes": ["Verified seat count modification.", "Requested approval from finance for credit memo."]
        }
    ]

    seeded_count = 0
    for item in sample_data:
        # Check if already seeded to prevent duplicates
        exists = db.query(Ticket).filter(Ticket.subject == item["subject"]).first()
        if exists:
            continue

        tid = generate_ticket_id(db)
        cat = classify_ticket(item["subject"], item["description"])
        t = Ticket(
            ticket_id=tid,
            customer_name=item["customer_name"],
            customer_email=item["customer_email"],
            subject=item["subject"],
            description=item["description"],
            status=item["status"],
            category=cat,
        )
        db.add(t)
        db.commit()
        db.refresh(t)

        for n in item.get("notes", []):
            note = Note(
                ticket_id=t.ticket_id,
                note_text=n,
                created_at=datetime.now(timezone.utc),
            )
            db.add(note)
        db.commit()
        seeded_count += 1

    print(f"Seeded {seeded_count} sample tickets successfully!")

    # Print summary
    tickets = db.query(Ticket).order_by(Ticket.ticket_id).all()
    print(f"\nTotal Tickets in DB: {len(tickets)}")
    for t in tickets:
        print(f"[{t.ticket_id}] ({t.status}) [{t.category}] {t.subject} - {t.customer_name} ({len(t.notes)} notes)")

finally:
    db.close()
