import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicket, updateTicket } from "../api/client.js";
import TicketDetail from "../components/TicketDetail.jsx";
import NoteList from "../components/NoteList.jsx";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [noteText, setNoteText] = useState("");

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicket(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  useEffect(() => {
    if (ticket) {
      document.title = `${ticket.ticket_id}: ${ticket.subject} — Support CRM`;
    } else {
      document.title = `Ticket ${ticketId} — Support CRM`;
    }
  }, [ticket, ticketId]);

  // ── Update status ──────────────────────────────────────
  async function handleUpdateStatus(newStatus) {
    if (newStatus === ticket.status) return;
    setUpdating(true);
    try {
      await updateTicket(ticketId, { status: newStatus });
      await fetchTicket(); // Re-fetch to get fresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  // ── Add note ───────────────────────────────────────────
  async function handleAddNote() {
    if (!noteText.trim()) return;
    setUpdating(true);
    try {
      await updateTicket(ticketId, { notes: noteText.trim() });
      setNoteText("");
      await fetchTicket(); // Re-fetch to see the new note
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="h-4 w-24 rounded bg-slate-200 animate-pulse-soft" />
        <div className="glass-card mt-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-20 rounded bg-slate-200 animate-pulse-soft" />
              <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse-soft" />
            </div>
            <div className="h-6 w-2/3 rounded bg-slate-200 animate-pulse-soft" />
            <div className="h-20 w-full rounded bg-slate-100 animate-pulse-soft" />
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="h-10 rounded bg-slate-100 animate-pulse-soft" />
              <div className="h-10 rounded bg-slate-100 animate-pulse-soft" />
              <div className="h-10 rounded bg-slate-100 animate-pulse-soft" />
              <div className="h-10 rounded bg-slate-100 animate-pulse-soft" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error / 404 state ──────────────────────────────────
  if (error && !ticket) {
    return (
      <div className="animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to list
        </Link>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-lg font-semibold text-red-600">Ticket not found</p>
          <p className="mt-1 text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // ── Main content ───────────────────────────────────────
  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-500 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to list
      </Link>

      {/* Update error banner */}
      {error && ticket && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-4">
        <TicketDetail
          ticket={ticket}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
          noteText={noteText}
          setNoteText={setNoteText}
          updating={updating}
        />
      </div>

      {/* ── Notes Timeline ─────────────────────────────────── */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-700">
          Notes
          {ticket.notes.length > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
              {ticket.notes.length}
            </span>
          )}
        </h3>
        <div className="mt-3 border-l-2 border-slate-200 pl-4">
          <NoteList notes={ticket.notes} />
        </div>
      </div>
    </div>
  );
}
