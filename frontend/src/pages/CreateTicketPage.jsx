import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTicket } from "../api/client.js";
import CreateTicketForm from "../components/CreateTicketForm.jsx";

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Create Ticket — Support CRM";
  }, []);

  async function handleSubmit(formData) {
    setLoading(true);
    setError(null);
    try {
      const result = await createTicket(formData);
      // On success, redirect to the newly created ticket's detail page
      navigate(`/tickets/${result.ticket_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-slate-800">Create New Ticket</h1>
        <p className="mt-1 text-sm text-slate-500">Submit a new customer support request</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">Failed to create ticket</p>
          <p className="mt-0.5 text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="glass-card mt-6 p-6 sm:p-8">
        <CreateTicketForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
