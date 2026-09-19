import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";
import CategoryBadge from "./CategoryBadge.jsx";

/**
 * TicketRow — a single ticket in the list.
 * Clicking navigates to the ticket detail page.
 */
export default function TicketRow({ ticket }) {
  const date = new Date(ticket.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/tickets/${ticket.ticket_id}`}
      className="glass-card block p-4 sm:p-5 animate-fade-in"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: ticket info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-indigo-500">
              {ticket.ticket_id}
            </span>
            <StatusBadge status={ticket.status} />
            <CategoryBadge category={ticket.category} />
          </div>
          <h3 className="mt-1 truncate text-sm font-semibold text-slate-800">
            {ticket.subject}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {ticket.customer_name}
          </p>
        </div>

        {/* Right: date + arrow */}
        <div className="flex items-center gap-3 sm:flex-shrink-0">
          <span className="text-xs text-slate-400">{date}</span>
          <svg
            className="h-4 w-4 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
