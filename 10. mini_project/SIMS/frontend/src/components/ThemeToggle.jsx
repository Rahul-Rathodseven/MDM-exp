import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      <span className="relative h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-700">
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            isDark ? "left-6" : "left-1"
          }`}
        ></span>
      </span>
      <span>{isDark ? "Dark" : "Light"} mode</span>
    </button>
  );
};

export default ThemeToggle;
