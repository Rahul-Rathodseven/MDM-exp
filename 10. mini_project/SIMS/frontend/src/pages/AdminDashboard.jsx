import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircleIcon, ClockIcon, FlagIcon, SparkIcon, TicketIcon } from "../components/AppIcons";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { getAllTicketsRequest } from "../services/ticketService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getAllTicketsRequest(user.id);
        const tickets = response.tickets || [];
        setStats({
          total: tickets.length,
          open: tickets.filter((ticket) => ticket.status === "Open").length,
          inProgress: tickets.filter((ticket) => ticket.status === "In Progress").length,
          closed: tickets.filter((ticket) => ticket.status === "Closed").length,
          highPriority: tickets.filter((ticket) => ticket.priority === "High").length
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user.id]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><LoadingSpinner label="Loading admin dashboard" /></div>;
  }

  return (
    <div className="page-stack">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="hero-panel">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_420px] xl:items-end">
          <div className="max-w-4xl">
            <p className="section-title">Admin Overview</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white xl:text-5xl">Operational visibility across the full ticket lifecycle</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 dark:text-slate-400 xl:text-lg">
              Review queue health, spot high-priority work quickly, and keep every operational change auditable from a dashboard that uses the full screen more effectively.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="metric-strip">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Urgent work</p>
              <div className="mt-4 text-4xl font-bold text-rose-600 dark:text-rose-300">{stats.highPriority}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Tickets currently flagged as high priority and likely to need faster follow-up.</p>
            </div>
            <div className="metric-strip">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Queue size</p>
              <div className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">{stats.total}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">All tickets currently visible across the support operation.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}

      <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-5">
        <StatCard title="Total Tickets" value={stats.total} description="All tickets currently in the platform" accent="bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300" icon={TicketIcon} />
        <StatCard title="Open" value={stats.open} description="Tickets waiting to enter active handling" accent="bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" icon={ClockIcon} />
        <StatCard title="In Progress" value={stats.inProgress} description="Requests currently being worked on" accent="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" icon={SparkIcon} />
        <StatCard title="Closed" value={stats.closed} description="Resolved tickets completed by admins" accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" icon={CheckCircleIcon} />
        <StatCard title="High Priority" value={stats.highPriority} description="Tickets highlighted for urgent attention" accent="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" icon={FlagIcon} />
      </section>
    </div>
  );
};

export default AdminDashboard;