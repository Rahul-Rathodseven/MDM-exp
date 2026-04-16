const LoadingSpinner = ({ label = "Loading" }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-slate-700"></div>
        <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600 dark:border-primary-500/20 dark:border-t-primary-300"></div>
      </div>
      <p className="text-sm font-medium tracking-wide">{label}</p>
    </div>
  );
};

export default LoadingSpinner;