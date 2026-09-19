import TicketRow from "./TicketRow.jsx";

/**
 * TicketList — renders a list of ticket cards or an empty/loading state.
 */
export default function TicketList({ tickets, loading, error }) {
  // ── Loading skeleton ────────────────────────────────────
  if (loading) {
    return (
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card animate-pulse-soft p-5"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 rounded bg-slate-200" />
              <div className="h-4 w-14 rounded-full bg-slate-200" />
            </div>
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
            <div className="mt-1 h-3 w-1/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────
  if (error) {
    return (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-600">Failed to load tickets</p>
        <p className="mt-1 text-xs text-red-400">{error}</p>
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────
  if (!tickets || tickets.length === 0) {
    return (
      <div className="mt-4 rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
        <svg
          className="mx-auto h-10 w-10 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
          />
        </svg>
        <p className="mt-3 text-sm font-medium text-slate-400">No tickets found</p>
        <p className="mt-1 text-xs text-slate-300">
          Try adjusting your search or filter, or create a new ticket.
        </p>
      </div>
    );
  }

  // ── Ticket list ─────────────────────────────────────────
  return (
    <div className="mt-4 space-y-3">
      {tickets.map((ticket) => (
        <TicketRow key={ticket.ticket_id} ticket={ticket} />
      ))}
    </div>
  );
}
