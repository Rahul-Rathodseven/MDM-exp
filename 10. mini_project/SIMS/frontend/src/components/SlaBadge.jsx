import { useEffect, useState } from "react";
import { ClockIcon } from "./AppIcons";

const formatRemaining = (totalMilliseconds) => {
  const totalMinutes = Math.floor(Math.abs(totalMilliseconds) / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const SlaBadge = ({ deadline }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  if (!deadline) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <ClockIcon className="h-3.5 w-3.5" />
        No SLA
      </span>
    );
  }

  const deadlineTime = new Date(deadline).getTime();
  const diff = deadlineTime - now;
  const overdue = diff < 0;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
      overdue
        ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
    }`}>
      <ClockIcon className="h-3.5 w-3.5" />
      {overdue ? `Overdue ${formatRemaining(diff)}` : `On Time ${formatRemaining(diff)}`}
    </span>
  );
};

export default SlaBadge;