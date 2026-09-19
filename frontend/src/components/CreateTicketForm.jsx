import { useState } from "react";

/**
 * CreateTicketForm — validated form for submitting a new support ticket.
 * Calls onSubmit(data) and handles loading/error states internally.
 */
export default function CreateTicketForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!form.customer_name.trim()) newErrors.customer_name = "Name is required";
    if (!form.customer_email.trim()) {
      newErrors.customer_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) {
      newErrors.customer_email = "Enter a valid email address";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  }

  const inputClass = (field) =>
    `w-full rounded-lg border ${
      errors[field] ? "border-red-300 ring-2 ring-red-100" : "border-slate-200"
    } bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Customer Name */}
      <div>
        <label htmlFor="customer_name" className="block text-sm font-medium text-slate-700">
          Customer Name <span className="text-red-400">*</span>
        </label>
        <input
          id="customer_name"
          name="customer_name"
          type="text"
          value={form.customer_name}
          onChange={handleChange}
          placeholder="Shreeraj Desai "
          className={`mt-1.5 ${inputClass("customer_name")}`}
        />
        {errors.customer_name && (
          <p className="mt-1 text-xs text-red-500">{errors.customer_name}</p>
        )}
      </div>

      {/* Customer Email */}
      <div>
        <label htmlFor="customer_email" className="block text-sm font-medium text-slate-700">
          Customer Email <span className="text-red-400">*</span>
        </label>
        <input
          id="customer_email"
          name="customer_email"
          type="email"
          value={form.customer_email}
          onChange={handleChange}
          placeholder="shreeraj@example.com"
          className={`mt-1.5 ${inputClass("customer_email")}`}
        />
        {errors.customer_email && (
          <p className="mt-1 text-xs text-red-500">{errors.customer_email}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
          Subject <span className="text-red-400">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          placeholder="Brief description of the issue"
          className={`mt-1.5 ${inputClass("subject")}`}
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Provide any additional details about the issue..."
          rows={4}
          className={`mt-1.5 resize-none ${inputClass("description")}`}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </>
          ) : (
            "Create Ticket"
          )}
        </button>
      </div>
    </form>
  );
}
