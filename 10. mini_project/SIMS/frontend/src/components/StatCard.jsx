import { motion } from "framer-motion";

const StatCard = ({ title, value, description, accent, icon: Icon }) => {
  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className="glass-panel group rounded-[2rem] p-6 lg:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-[1.25rem] shadow-sm transition duration-300 group-hover:scale-105 ${accent}`}>
          {Icon ? <Icon className="h-7 w-7" /> : null}
        </div>
        <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400">
          Live
        </div>
      </div>
      <p className="mt-7 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950 dark:text-white xl:text-[2.65rem]">{value}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
    </motion.div>
  );
};

export default StatCard;