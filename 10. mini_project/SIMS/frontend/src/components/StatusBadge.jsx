const palette = {
  Open: "bg-blue-100 text-blue-700 ring-blue-600/10 dark:bg-blue-500/15 dark:text-blue-300",
  "In Progress": "bg-amber-100 text-amber-700 ring-amber-600/10 dark:bg-amber-500/15 dark:text-amber-300",
  Closed: "bg-emerald-100 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/15 dark:text-emerald-300"
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        palette[status] || "bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
