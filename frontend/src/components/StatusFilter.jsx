/**
 * StatusFilter — dropdown to filter tickets by status.
 * Options: All, Open, In Progress, Closed.
 */
export default function StatusFilter({ value, onChange }) {
  return (
    <select
      id="status-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    >
      <option value="">All Statuses</option>
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Closed">Closed</option>
    </select>
  );
}
