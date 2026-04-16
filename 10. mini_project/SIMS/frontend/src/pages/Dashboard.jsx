import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, ClockIcon, FlagIcon, SparkIcon, TicketIcon } from "../components/AppIcons";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { getUserTicketsRequest } from "../services/ticketService";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, open: 0, closed: 0, inProgress: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getUserTicketsRequest(user.id);
        const tickets = response.tickets || [];
        setStats({
          total: tickets.length,
          open: tickets.filter((ticket) => ticket.status === "Open").length,
          closed: tickets.filter((ticket) => ticket.status === "Closed").length,
          inProgress: tickets.filter((ticket) => ticket.status === "In Progress").length,
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
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner label="Loading dashboard" /></div>;
  }

  return (
    <div className="page-stack">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="hero-panel">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_380px] xl:items-end">
          <div className="max-w-4xl">
            <p className="section-title">Ticket Overview</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white xl:text-5xl">A support workspace that feels ready for real operations.</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 dark:text-slate-400 xl:text-lg">
              Create inquiries, track priority and progress, and follow every important change through a clear activity timeline designed for real customer support workflows.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">Live ticket visibility</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">Priority-aware queue</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">Basic email updates</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="metric-strip">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Account snapshot</p>
              <div className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">{stats.total}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Tickets created by your account across all categories and recent requests.</p>
            </div>
            <div className="flex flex-wrap gap-3 xl:justify-end">
              <Link to="/submit-inquiry" className="btn-primary">Submit Inquiry</Link>
              <Link to="/my-tickets" className="btn-secondary">View Tickets</Link>
            </div>
          </div>
        </div>
      </motion.section>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}

      <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-5">
        <StatCard title="Total Tickets" value={stats.total} description="All inquiries created by your account" accent="bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300" icon={TicketIcon} />
        <StatCard title="Open Tickets" value={stats.open} description="Requests waiting for active resolution" accent="bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" icon={ClockIcon} />
        <StatCard title="In Progress" value={stats.inProgress} description="Tickets currently being handled" accent="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" icon={SparkIcon} />
        <StatCard title="Closed Tickets" value={stats.closed} description="Resolved inquiries archived for reference" accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" icon={CheckCircleIcon} />
        <StatCard title="High Priority" value={stats.highPriority} description="Tickets flagged for faster handling" accent="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" icon={FlagIcon} />
      </section>
    </div>
  );
};

export default Dashboard;