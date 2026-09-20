"""
Automated end-to-end integration test for the Support CRM API.
Verifies:
1. List tickets (GET /api/tickets)
2. Filter by status (GET /api/tickets?status=Open)
3. Search by text (GET /api/tickets?search=password)
4. Create new ticket with auto-categorization (POST /api/tickets)
5. Get single ticket with notes (GET /api/tickets/{id})
6. Update ticket status (PUT /api/tickets/{id})
7. Add note to ticket (PUT /api/tickets/{id})
"""
import os
import sys
import urllib.request
import urllib.parse
import json

# Use PORT env var (Railway sets this dynamically) or fall back to 8000 for local dev
_port = os.environ.get("PORT", "8000")
BASE_URL = os.environ.get("TEST_BASE_URL", f"http://127.0.0.1:{_port}")

def request(method, path, body=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Content-Type": "application/json"} if body is not None else {}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_tests():
    print("=== Running CRM API Tests ===")

    # 1. List tickets
    tickets = request("GET", "/api/tickets")
    print(f"[PASS] 1. GET /api/tickets: retrieved {len(tickets)} tickets")

    # 2. Filter by status
    open_tickets = request("GET", "/api/tickets?status=Open")
    assert all(t["status"] == "Open" for t in open_tickets), "Status filter failed"
    print(f"[PASS] 2. GET /api/tickets?status=Open: retrieved {len(open_tickets)} open tickets")

    # 3. Search tickets
    search_res = request("GET", "/api/tickets?search=password")
    assert len(search_res) > 0, "Search failed"
    print(f"[PASS] 3. GET /api/tickets?search=password: found {len(search_res)} matching tickets")

    # 4. Create new ticket (auto-categorization test: "refund invoice" -> Billing)
    new_ticket = request("POST", "/api/tickets", {
        "customer_name": "Test User",
        "customer_email": "test@example.com",
        "subject": "Requesting invoice refund for duplicate transaction",
        "description": "Please check invoice #9942 and credit our account."
    })
    ticket_id = new_ticket["ticket_id"]
    category = new_ticket.get("category")
    print(f"[PASS] 4. POST /api/tickets: created {ticket_id}, auto-classified category: '{category}'")
    assert category == "Billing", f"Expected category 'Billing', got '{category}'"

    # 5. Get ticket details
    detail = request("GET", f"/api/tickets/{ticket_id}")
    assert detail["ticket_id"] == ticket_id
    assert detail["status"] == "Open"
    print(f"[PASS] 5. GET /api/tickets/{ticket_id}: details loaded correctly")

    # 6. Update status to 'In Progress'
    updated = request("PUT", f"/api/tickets/{ticket_id}", {"status": "In Progress"})
    assert updated.get("success") is True, f"PUT status returned {updated}"
    refetched = request("GET", f"/api/tickets/{ticket_id}")
    assert refetched["status"] == "In Progress"
    print(f"[PASS] 6. PUT /api/tickets/{ticket_id}: status changed to 'In Progress'")

    # 7. Add a note
    noted = request("PUT", f"/api/tickets/{ticket_id}", {"notes": "Customer provided proof of transaction."})
    assert noted.get("success") is True, f"PUT note returned {noted}"
    detail_with_notes = request("GET", f"/api/tickets/{ticket_id}")
    assert len(detail_with_notes["notes"]) >= 1
    assert any("Customer provided proof" in n["note_text"] for n in detail_with_notes["notes"])
    print(f"[PASS] 7. PUT /api/tickets/{ticket_id}: note appended successfully ({len(detail_with_notes['notes'])} notes total)")

    print("\n[ALL 7 API TESTS PASSED SUCCESSFULLY!]")

if __name__ == "__main__":
    run_tests()
