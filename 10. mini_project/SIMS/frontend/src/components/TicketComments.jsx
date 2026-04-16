import { ChatIcon, SendIcon } from "./AppIcons";

const formatCommentTime = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });

const TicketComments = ({ comments = [], commentText, onCommentChange, onCommentSubmit, sending = false }) => {
  return (
    <section className="glass-panel rounded-[2rem] p-7 xl:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <ChatIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Comments</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Discuss the ticket in a simple chat-style thread shared between users and admins.</p>
        </div>
      </div>

      <div className="mt-7 max-h-[420px] space-y-4 overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-950/40">
        {comments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No comments yet. Start the conversation here.
          </div>
        ) : comments.map((comment) => {
          const isAdmin = comment.user_role === "admin";

          return (
            <div key={comment.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-[1.5rem] px-4 py-4 shadow-sm ${
                isAdmin
                  ? "bg-primary-600 text-white"
                  : "bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200"
              }`}>
                <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${isAdmin ? "text-primary-100" : "text-slate-500 dark:text-slate-400"}`}>
                  {comment.user_name}
                </div>
                <p className="mt-2 text-sm leading-7">{comment.message}</p>
                <div className={`mt-3 text-[11px] ${isAdmin ? "text-primary-100/90" : "text-slate-500 dark:text-slate-400"}`}>
                  {formatCommentTime(comment.created_at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={onCommentSubmit} className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Add comment</label>
          <textarea
            value={commentText}
            onChange={(event) => onCommentChange(event.target.value)}
            className="input-control min-h-[110px] resize-none"
            placeholder="Write a message for this ticket"
            required
          />
        </div>
        <button className="btn-primary min-w-[160px]" type="submit" disabled={sending}>
          <SendIcon className="h-4 w-4" />
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
};

export default TicketComments;