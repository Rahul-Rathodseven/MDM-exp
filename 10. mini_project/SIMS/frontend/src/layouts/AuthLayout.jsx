import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const copy = {
  user: {
    eyebrow: "Customer Portal",
    title: "Handle every inquiry with clarity and speed.",
    description: "Submit questions, track progress, and stay updated through a polished support workflow.",
    cta: { label: "Create account", href: "/register" }
  },
  admin: {
    eyebrow: "Admin Portal",
    title: "Manage ticket operations from a dedicated control center.",
    description: "Separate admin access, operational visibility, and clean ticket handling in one focused workspace.",
    cta: { label: "Back to user login", href: "/login" }
  }
};

const AuthLayout = ({ variant = "user" }) => {
  const content = copy[variant];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl justify-end py-2">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden overflow-hidden rounded-[2rem] bg-slate-950 p-10 text-white shadow-panel lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,127,249,0.45),transparent_30%)]"></div>
          <div className="absolute inset-0 bg-grid bg-[size:34px_34px] opacity-20"></div>
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary-200">{content.eyebrow}</p>
              <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight">{content.title}</h1>
              <p className="mt-5 max-w-lg text-base text-slate-300">{content.description}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-slate-300">Smart Inquiry Management System</p>
              <p className="mt-2 text-2xl font-semibold">Modern support workflows for compact teams.</p>
              <Link to={content.cta.href} className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100">
                {content.cta.label}
              </Link>
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-xl">
            <Outlet />
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AuthLayout;
