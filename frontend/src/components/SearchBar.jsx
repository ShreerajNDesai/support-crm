import { useState, useEffect, useRef } from "react";

/**
 * SearchBar — debounced text input (300ms) for filtering tickets.
 * Calls onSearch(value) after the debounce delay.
 */
export default function SearchBar({ onSearch, value = "" }) {
  const [input, setInput] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any pending debounce when the component unmounts
    return () => clearTimeout(timerRef.current);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setInput(val);

    // Debounce: wait 300ms after the user stops typing
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(val);
    }, 50);
  }

  return (
    <div className="relative flex-1">
      {/* Search icon */}
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <input
        id="search-tickets"
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Search by name, email, ticket ID, subject..."
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}
