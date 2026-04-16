import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ ...formData, expectedRole: "admin" });
      toast.success("Admin access granted", "Welcome to the operations hub.");
      navigate(location.state?.from?.pathname || "/admin");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-8 sm:p-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">Admin Login</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Secure access to ticket operations</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">This portal is reserved for administrators managing system-wide ticket workflows.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Admin email</label>
          <input className="input-control" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@sims.local" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
          <input className="input-control" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter admin password" required />
        </div>
        {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? "Authorizing..." : "Enter Admin Portal"}</button>
      </form>

      <div className="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400">
        <p>Demo credentials: <span className="font-semibold text-slate-700 dark:text-slate-200">admin@sims.local / admin123</span></p>
        <p>
          Need the user portal? <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-300">Go to user login</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
