/**
 * API client — thin fetch wrapper with base URL from environment.
 * All API calls go through this module so the backend URL is never hardcoded.
 */

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
// Strip trailing slash if present to avoid double slashes like https://api.com//api/tickets
const BASE_URL = rawUrl.replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  const response = await fetch(url, config);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    if (contentType.includes("application/json")) {
      const errorData = await response.json().catch(() => ({}));
      message = errorData.detail || message;
    }
    throw new Error(Array.isArray(message) ? message.map(e => e.msg).join(", ") : message);
  }

  // Guard against HTML responses (e.g. Vercel SPA rewrite when URL points to frontend instead of backend)
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Received HTML instead of JSON from "${url}". Please verify VITE_API_URL in Vercel points to your Railway backend URL, not the Vercel frontend URL.`
    );
  }

  return response.json();
}

/** POST /api/tickets — create a new ticket */
export function createTicket(data) {
  return request("/api/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** GET /api/tickets — list tickets with optional filters */
export function listTickets({ status, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  const query = params.toString();
  return request(`/api/tickets${query ? `?${query}` : ""}`);
}

/** GET /api/tickets/:ticket_id — get single ticket detail */
export function getTicket(ticketId) {
  return request(`/api/tickets/${ticketId}`);
}

/** PUT /api/tickets/:ticket_id — update status and/or add note */
export function updateTicket(ticketId, data) {
  return request(`/api/tickets/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
