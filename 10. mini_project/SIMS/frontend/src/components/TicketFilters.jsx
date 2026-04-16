const TicketFilters = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  placeholder = "Search tickets",
  resultsCount
}) => {
  return (
    <div className="glass-panel rounded-[2rem] p-6 lg:p-7 xl:p-8">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_260px_260px_190px] xl:items-end">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Search tickets</label>
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={placeholder}
            className="input-control"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Search by ticket ID, subject, message, requester, or category.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Status</label>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="input-control"
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Priority</label>
          <select
            value={priority}
            onChange={(event) => onPriorityChange(event.target.value)}
            className="input-control"
          >
            <option value="All">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {typeof resultsCount === "number" ? (
          <div className="metric-strip flex h-[54px] items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
            Showing {resultsCount} tickets
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TicketFilters;