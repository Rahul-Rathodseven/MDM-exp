import { motion } from "framer-motion";
import { ClockIcon, FlagIcon, TicketIcon, TimelineIcon } from "./AppIcons";

const getTimelinePresentation = (action = "") => {
  if (action.toLowerCase().includes("created")) {
    return {
      icon: TicketIcon,
      wrapper: "bg-primary-100 text-primary-700 ring-primary-600/10 dark:bg-primary-500/15 dark:text-primary-300"
    };
  }

  if (action.toLowerCase().includes("status")) {
    return {
      icon: ClockIcon,
      wrapper: "bg-blue-100 text-blue-700 ring-blue-600/10 dark:bg-blue-500/15 dark:text-blue-300"
    };
  }

  if (action.toLowerCase().includes("priority")) {
    return {
      icon: FlagIcon,
      wrapper: "bg-amber-100 text-amber-700 ring-amber-600/10 dark:bg-amber-500/15 dark:text-amber-300"
    };
  }

  return {
    icon: TimelineIcon,
    wrapper: "bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300"
  };
};

const formatTimestamp = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });

const TicketTimeline = ({ logs = [] }) => {
  return (
    <section className="glass-panel rounded-[2rem] p-8 xl:p-10">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="section-title">Activity Timeline</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Every major ticket event in one place</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            This audit trail helps teams understand who changed what and when, without digging through multiple screens.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <TimelineIcon className="h-5 w-5" />
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-200 px-6 py-8 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No activity has been recorded for this ticket yet.
        </div>
      ) : (
        <div className="relative mt-10 space-y-7 before:absolute before:bottom-4 before:left-[1.2rem] before:top-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
          {logs.map((log, index) => {
            const presentation = getTimelinePresentation(log.action);
            const TimelineActionIcon = presentation.icon;

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="relative flex gap-5 pl-12"
              >
                <span className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ring-inset ${presentation.wrapper}`}>
                  <TimelineActionIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 rounded-3xl border border-slate-200/80 bg-white/70 px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="text-base font-semibold text-slate-950 dark:text-white">{log.action}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{log.performed_by}</span>
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TicketTimeline;