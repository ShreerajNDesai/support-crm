import StatusBadge from "./StatusBadge.jsx";
import CategoryBadge from "./CategoryBadge.jsx";

/**
 * TicketDetail — displays all ticket fields, status dropdown, and note input.
 * Delegates status/note updates to parent via onUpdateStatus and onAddNote.
 */
export default function TicketDetail({
  ticket,
  onUpdateStatus,
  onAddNote,
  noteText,
  setNoteText,
  updating,
}) {
  const createdDate = new Date(ticket.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const updatedDate = new Date(ticket.updated_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6">
      {/* ── Header Card ────────────────────────────────────── */}
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-bold text-indigo-500">
                {ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} />
              <CategoryBadge category={ticket.category} />
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-800">{ticket.subject}</h2>
          </div>

          {/* Status Update Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-update" className="text-xs font-medium text-slate-500">
              Status:
            </label>
            <select
              id="status-update"
              value={ticket.status}
              onChange={(e) => onUpdateStatus(e.target.value)}
              disabled={updating}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        {ticket.description && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        )}

        {/* Meta Info Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-slate-400">Customer</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-700">{ticket.customer_name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Email</p>
            <p className="mt-0.5 text-sm text-slate-700">
              <a href={`mailto:${ticket.customer_email}`} className="text-indigo-500 hover:underline">
                {ticket.customer_email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Created</p>
            <p className="mt-0.5 text-sm text-slate-700">{createdDate}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Last Updated</p>
            <p className="mt-0.5 text-sm text-slate-700">{updatedDate}</p>
          </div>
        </div>
      </div>

      {/* ── Add Note ───────────────────────────────────────── */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-slate-700">Add a Note</h3>
        <div className="mt-3">
          <textarea
            id="note-input"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note about this ticket..."
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={onAddNote}
              disabled={!noteText.trim() || updating}
              className="btn-primary flex items-center gap-2 text-xs"
            >
              {updating ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Add Note"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
