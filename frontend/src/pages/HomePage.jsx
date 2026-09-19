import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { listTickets } from "../api/client.js";
import SearchBar from "../components/SearchBar.jsx";
import StatusFilter from "../components/StatusFilter.jsx";
import TicketList from "../components/TicketList.jsx";

export default function HomePage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Fetch tickets whenever search or status filter changes
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTickets({ status: status || undefined, search: search || undefined });
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    document.title = "Tickets Dashboard — Support CRM";
    fetchTickets();
  }, [fetchTickets]);

  // Count tickets by status for the summary bar
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;

  return (
    <div className="animate-fade-in">
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track all customer support requests
          </p>
        </div>
        <Link to="/new" className="btn-primary inline-flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Ticket
        </Link>
      </div>

      {/* ── Stats Bar ────────────────────────────────────── */}
      {!loading && !error && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{openCount}</p>
            <p className="text-xs font-medium text-emerald-500">Open</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{inProgressCount}</p>
            <p className="text-xs font-medium text-amber-500">In Progress</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-slate-500">{closedCount}</p>
            <p className="text-xs font-medium text-slate-400">Closed</p>
          </div>
        </div>
      )}

      {/* ── Search + Filter ──────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar onSearch={setSearch} value={search} />
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      {/* ── Ticket List ──────────────────────────────────── */}
      <TicketList tickets={tickets} loading={loading} error={error} />

      {/* ── Result count ─────────────────────────────────── */}
      {!loading && !error && tickets.length > 0 && (
        <p className="mt-4 text-center text-xs text-slate-400">
          Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          {(search || status) ? " (filtered)" : ""}
        </p>
      )}
    </div>
  );
}
