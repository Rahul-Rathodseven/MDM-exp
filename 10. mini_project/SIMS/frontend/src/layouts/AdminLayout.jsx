import { motion } from "framer-motion";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const navLink = ({ isActive }) =>
  `flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <div className="app-shell grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-6 h-fit rounded-[2.25rem] bg-slate-950 p-7 text-white shadow-panel xl:p-8"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-primary-300">SIMS Admin</p>
          <h2 className="mt-4 text-3xl font-bold xl:text-[2rem]">Operations Hub</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">Professional visibility into ticket workload, queue pressure, and ticket changes across the system.</p>

          <div className="mt-10 space-y-2">
            <NavLink to="/admin" end className={navLink}>Dashboard</NavLink>
            <NavLink to="/admin/tickets" className={navLink}>Manage Tickets</NavLink>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
            <p className="mt-2 text-lg font-semibold">{user?.name}</p>
            <p className="mt-1 break-all text-sm text-slate-400">{user?.email}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ThemeToggle />
            <button type="button" onClick={handleLogout} className="btn-secondary w-full border-slate-700 bg-slate-900 text-white hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900">
              Logout
            </button>
          </div>
        </motion.aside>

        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;