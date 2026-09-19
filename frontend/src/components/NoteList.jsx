/**
 * NoteList — chronological timeline of notes on a ticket.
 */
export default function NoteList({ notes }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center">
        <svg
          className="mx-auto h-8 w-8 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
        <p className="mt-2 text-sm font-medium text-slate-400">No notes yet</p>
        <p className="mt-0.5 text-xs text-slate-300">Add a note to start the conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note, index) => {
        const date = new Date(note.created_at);
        const timeStr = date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div
            key={index}
            className="animate-fade-in relative rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[7px] top-5 h-3 w-3 rounded-full border-2 border-indigo-400 bg-white" />

            <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.note_text}</p>
            <p className="mt-2 text-xs text-slate-400">{timeStr}</p>
          </div>
        );
      })}
    </div>
  );
}
