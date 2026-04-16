import { Link, NavLink, useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

const navBase =
  "rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-slate-100";

const navActive = "bg-brand-50 text-brand-700";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem("simsUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold text-slate-900">
              Smart Inquiry Management System
            </Link>
            <p className="text-sm text-slate-500">
              Track inquiries, manage tickets, and keep communication organized.
            </p>
          </div>
          {user && (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <nav className="flex flex-wrap gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${navBase} ${isActive ? navActive : "text-slate-600"}`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/submit-inquiry"
                  className={({ isActive }) =>
                    `${navBase} ${isActive ? navActive : "text-slate-600"}`
                  }
                >
                  Submit Inquiry
                </NavLink>
                <NavLink
                  to="/my-tickets"
                  className={({ isActive }) =>
                    `${navBase} ${isActive ? navActive : "text-slate-600"}`
                  }
                >
                  My Tickets
                </NavLink>
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `${navBase} ${isActive ? navActive : "text-slate-600"}`
                    }
                  >
                    Admin Panel
                  </NavLink>
                )}
              </nav>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{user.name}</span> ({user.role})
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
