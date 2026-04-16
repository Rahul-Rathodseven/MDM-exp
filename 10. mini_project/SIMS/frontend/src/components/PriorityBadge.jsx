const palette = {
  Low: "bg-emerald-100 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/15 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 ring-amber-600/10 dark:bg-amber-500/15 dark:text-amber-300",
  High: "bg-rose-100 text-rose-700 ring-rose-600/10 dark:bg-rose-500/15 dark:text-rose-300"
};

const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition ${
        palette[priority] || "bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;