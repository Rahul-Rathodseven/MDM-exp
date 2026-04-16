import { motion } from "framer-motion";
import { PaperclipIcon } from "./AppIcons";
import PriorityBadge from "./PriorityBadge";
import SlaBadge from "./SlaBadge";
import StatusBadge from "./StatusBadge";

const TicketTable = ({
  tickets,
  showUser = false,
  renderActions,
  emptyMessage = "No tickets found.",
  loading = false
}) => {
  const columnCount = 7 + (showUser ? 1 : 0) + (renderActions ? 1 : 0);

  return (
    <div className="glass-panel overflow-hidden rounded-[2rem]">
      <div className="max-h-[76vh] overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead className="bg-slate-50/95 backdrop-blur dark:bg-slate-950/90">
            <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              <th className="sticky top-0 z-10 px-7 py-5">Ticket</th>
              {showUser ? <th className="sticky top-0 z-10 px-7 py-5">Requester</th> : null}
              <th className="sticky top-0 z-10 px-7 py-5">Subject</th>
              <th className="sticky top-0 z-10 px-7 py-5">Category</th>
              <th className="sticky top-0 z-10 px-7 py-5">Status</th>
              <th className="sticky top-0 z-10 px-7 py-5">Priority</th>
              <th className="sticky top-0 z-10 px-7 py-5">SLA</th>
              <th className="sticky top-0 z-10 px-7 py-5">Updated</th>
              {renderActions ? <th className="sticky top-0 z-10 px-7 py-5">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    <td className="px-7 py-6" colSpan={columnCount}>
                      <div className="grid animate-pulse gap-4 md:grid-cols-4 xl:grid-cols-6">
                        <div className="h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                      </div>
                    </td>
                  </tr>
                ))
              : null}

            {!loading && tickets.length === 0 ? (
              <tr>
                <td className="px-7 py-14 text-center text-slate-500 dark:text-slate-400" colSpan={columnCount}>
                  {emptyMessage}
                </td>
              </tr>
            ) : null}

            {!loading &&
              tickets.map((ticket, index) => {
                const isHighPriority = ticket.priority === "High";

                return (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`${
                      isHighPriority ? "bg-rose-50/70 dark:bg-rose-500/5" : ""
                    } transition hover:bg-slate-50/80 dark:hover:bg-slate-900/50`}
                  >
                    <td className="px-7 py-6 align-top font-semibold text-slate-950 dark:text-white">
                      <div className="text-base">#{ticket.id}</div>
                      <div className="mt-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                        {isHighPriority ? "Needs faster attention" : "Active support ticket"}
                      </div>
                    </td>
                    {showUser ? (
                      <td className="px-7 py-6 align-top">
                        <div className="font-medium">{ticket.user_name}</div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{ticket.user_email}</div>
                      </td>
                    ) : null}
                    <td className="px-7 py-6 align-top">
                      <div className="flex flex-wrap items-center gap-2 font-medium text-slate-900 dark:text-white">
                        <span>{ticket.subject}</span>
                        {ticket.attachment_path ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <PaperclipIcon className="h-3.5 w-3.5" />
                            Attachment
                          </span>
                        ) : null}
                      </div>
                      {ticket.message ? (
                        <div className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {ticket.message}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-7 py-6 align-top text-sm">{ticket.category}</td>
                    <td className="px-7 py-6 align-top">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-7 py-6 align-top">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-7 py-6 align-top">
                      <SlaBadge deadline={ticket.sla_deadline} />
                    </td>
                    <td className="px-7 py-6 align-top text-sm text-slate-500 dark:text-slate-400">
                      {new Date(ticket.updated_at || ticket.created_at).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </td>
                    {renderActions ? <td className="px-7 py-6 align-top">{renderActions(ticket)}</td> : null}
                  </motion.tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;