"""
Utility functions — ticket ID generation and AI auto-categorization.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Ticket


def generate_ticket_id(db: Session) -> str:
    """
    Generate the next ticket ID in the format TKT-001, TKT-002, etc.
    Queries the current max `id` in the tickets table and increments by 1.
    If the table is empty, starts at TKT-001.
    """
    max_id = db.query(func.max(Ticket.id)).scalar()
    next_num = (max_id or 0) + 1
    return f"TKT-{next_num:03d}"


# ── AI Auto-Categorization ──────────────────────────────────────
# MVP: keyword matching. Structured so an LLM API call (e.g. OpenAI,
# Google Gemini) can be swapped in by replacing classify_ticket()
# without changing the caller.

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "Billing": [
        "billing", "invoice", "charge", "payment", "refund", "subscription",
        "plan", "price", "cost", "credit card", "receipt", "overcharge",
        "discount", "coupon", "renewal", "upgrade", "downgrade",
    ],
    "Technical": [
        "bug", "error", "crash", "slow", "broken", "not working", "fix",
        "issue", "problem", "glitch", "login", "password", "reset",
        "loading", "timeout", "404", "500", "api", "integration",
        "performance", "latency", "outage", "down",
    ],
    "Account": [
        "account", "profile", "delete account", "deactivate", "settings",
        "username", "email change", "permissions", "access", "role",
        "two-factor", "2fa", "verification", "security",
    ],
    "Feature Request": [
        "feature", "request", "suggestion", "would be nice", "add support",
        "dark mode", "enhancement", "improvement", "wish", "roadmap",
        "new feature", "integration", "export", "import",
    ],
}


def classify_ticket(subject: str, description: str | None = None) -> str:
    """
    Classify a ticket into a category based on keyword matching.

    MVP implementation: scans subject + description for keywords and picks
    the category with the most matches. Returns 'Other' if no keywords hit.

    Production upgrade path: replace this body with an LLM API call:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Classify: {subject} {description}"}],
        )
        return response.choices[0].message.content.strip()
    """
    text = f"{subject} {description or ''}".lower()

    scores: dict[str, int] = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > 0:
            scores[category] = score

    if not scores:
        return "Other"

    return max(scores, key=scores.get)
