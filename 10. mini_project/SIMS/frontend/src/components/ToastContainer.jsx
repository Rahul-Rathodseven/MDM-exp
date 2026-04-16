import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100",
  error: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100",
  info: "border-primary-200 bg-primary-50 text-primary-900 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-100"
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            className={`pointer-events-auto rounded-2xl border px-4 py-4 shadow-panel ${toneClasses[toast.type]}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-sm opacity-90">{toast.message}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-sm font-semibold opacity-70 transition hover:opacity-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
