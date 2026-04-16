const EmptyState = ({ title, description, action }) => {
  return (
    <div className="glass-panel rounded-3xl px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[1.7]">
          <path d="M8 7h8M8 12h8M8 17h5" strokeLinecap="round" />
          <path d="M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
