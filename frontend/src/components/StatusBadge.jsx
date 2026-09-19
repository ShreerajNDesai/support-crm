/**
 * StatusBadge — color-coded pill for ticket status.
 * Open = green, In Progress = amber, Closed = gray
 */
export default function StatusBadge({ status }) {
  const styles = {
    Open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "In Progress": "bg-amber-50 text-amber-700 ring-amber-600/20",
    Closed: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status] || styles.Open}`}
    >
      {status}
    </span>
  );
}
