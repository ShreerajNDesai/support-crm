/**
 * CategoryBadge — color-coded pill for AI-assigned ticket category.
 * Billing = blue, Technical = red, Account = purple, Feature Request = teal, Other = slate
 */
export default function CategoryBadge({ category }) {
  if (!category) return null;

  const styles = {
    Billing: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Technical: "bg-rose-50 text-rose-700 ring-rose-600/20",
    Account: "bg-violet-50 text-violet-700 ring-violet-600/20",
    "Feature Request": "bg-teal-50 text-teal-700 ring-teal-600/20",
    Other: "bg-slate-50 text-slate-600 ring-slate-500/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[category] || styles.Other}`}
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
      {category}
    </span>
  );
}
