import { motion } from "framer-motion";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const linkClasses = ({ isActive }) =>
  `rounded-2xl px-5 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel app-shell flex flex-col gap-6 rounded-[2.25rem] px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-10"
      >
        <div className="max-w-2xl">
          <p className="section-title">SIMS User Portal</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white xl:text-4xl">Welcome back, {user?.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Track inquiries, review updates, and manage every support conversation from a workspace built to scale cleanly.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-auto lg:min-w-[560px] lg:items-end">
          <nav className="flex flex-wrap gap-2 lg:justify-end">
            <NavLink to="/" end className={linkClasses}>Dashboard</NavLink>
            <NavLink to="/submit-inquiry" className={linkClasses}>Submit Inquiry</NavLink>
            <NavLink to="/my-tickets" className={linkClasses}>My Tickets</NavLink>
          </nav>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <ThemeToggle />
            <button type="button" onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </motion.header>
      <main className="app-shell mt-8 xl:mt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;