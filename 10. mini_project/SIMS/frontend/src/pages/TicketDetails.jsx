import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, DownloadIcon, MailIcon, PaperclipIcon, UserIcon } from "../components/AppIcons";
import LoadingSpinner from "../components/LoadingSpinner";
import PriorityBadge from "../components/PriorityBadge";
import SlaBadge from "../components/SlaBadge";
import StatusBadge from "../components/StatusBadge";
import TicketComments from "../components/TicketComments";
import TicketTimeline from "../components/TicketTimeline";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { addCommentRequest, getCommentsRequest, getTicketDetailsRequest, updateTicketRequest } from "../services/ticketService";
import { buildBackendAssetUrl } from "../utils/assetUrl";

const statusOptions = ["Open", "In Progress", "Closed"];
const priorityOptions = ["Low", "Medium", "High"];

const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });

const formatFileName = (path) => {
  if (!path) {
    return "Attachment";
  }

  const segments = path.split("/");
  return decodeURIComponent(segments[segments.length - 1]);
};

const isImageAttachment = (path) => /\.(jpg|jpeg|png|gif|webp)$/i.test(path || "");

const TicketDetails = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const toast = useToast();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [error, setError] = useState("");

  const backPath = isAdmin ? "/admin/tickets" : "/my-tickets";

  const queryContext = {
    ticketId,
    userId: isAdmin ? undefined : user.id,
    adminUserId: isAdmin ? user.id : undefined
  };

  const loadTicketDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const [ticketResponse, commentsResponse] = await Promise.all([
        getTicketDetailsRequest(queryContext),
        getCommentsRequest(queryContext)
      ]);

      setTicket(ticketResponse.ticket);
      setActivityLogs(ticketResponse.activity_logs || []);
      setComments(commentsResponse.comments || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketDetails();
  }, [ticketId, user.id, isAdmin]);

  const handleAdminUpdate = async (field, value) => {
    if (!isAdmin) {
      return;
    }

    setSavingField(field);
    setError("");

    try {
      await updateTicketRequest({
        ticket_id: Number(ticketId),
        admin_user_id: user.id,
        [field]: value
      });
      toast.success("Ticket updated", `Ticket #${ticketId} ${field} changed to ${value}.`);
      await loadTicketDetails();
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Update failed", requestError.message);
    } finally {
      setSavingField("");
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      return;
    }

    setSendingComment(true);
    setError("");

    try {
      const response = await addCommentRequest({
        ticket_id: Number(ticketId),
        user_id: user.id,
        message: trimmedComment
      });

      if (response.comment) {
        setComments((currentComments) => [...currentComments, response.comment]);
      }

      setCommentText("");
      toast.success("Comment added", "The ticket conversation has been updated.");
      const ticketResponse = await getTicketDetailsRequest(queryContext);
      setTicket(ticketResponse.ticket);
      setActivityLogs(ticketResponse.activity_logs || []);
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Comment failed", requestError.message);
    } finally {
      setSendingComment(false);
    }
  };

  const attachmentUrl = buildBackendAssetUrl(ticket?.attachment_path);
  const attachmentName = formatFileName(ticket?.attachment_path);

  return (
    <div className="page-stack">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to={backPath} className="btn-secondary w-fit">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to tickets
        </Link>
        {ticket ? (
          <div className="flex flex-wrap gap-3">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <SlaBadge deadline={ticket.sla_deadline} />
          </div>
        ) : null}
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner label="Loading ticket details" />
        </div>
      ) : ticket ? (
        <>
          <div className="grid gap-8 2xl:grid-cols-[minmax(0,1.45fr)_420px]">
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-8 lg:p-10 xl:p-12">
              <p className="section-title">{isAdmin ? "Admin Ticket Details" : "Ticket Details"}</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white xl:text-[3.4rem]">#{ticket.id} {ticket.subject}</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500 dark:text-slate-400">
                Track the current SLA, review the original request, download any attachment, and continue the conversation from one workspace.
              </p>

              <div className="mt-8 grid gap-5 rounded-[1.75rem] border border-slate-200 bg-slate-50/75 p-6 md:grid-cols-2 xl:grid-cols-4 dark:border-slate-700 dark:bg-slate-950/40">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Category</div>
                  <div className="mt-3 text-base font-semibold text-slate-950 dark:text-white">{ticket.category}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Requester</div>
                  <div className="mt-3 text-base font-semibold text-slate-950 dark:text-white">{ticket.user_name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Created</div>
                  <div className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{formatDateTime(ticket.created_at)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Last Updated</div>
                  <div className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{formatDateTime(ticket.updated_at || ticket.created_at)}</div>
                </div>
              </div>

              <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Inquiry message</h2>
                  <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 text-sm leading-8 text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300 xl:p-8">
                    {ticket.message}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 dark:border-slate-700 dark:bg-slate-950/40">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">SLA health</div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <SlaBadge deadline={ticket.sla_deadline} />
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      Deadline: {ticket.sla_deadline ? formatDateTime(ticket.sla_deadline) : "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 dark:border-slate-700 dark:bg-slate-950/40">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      <PaperclipIcon className="h-4 w-4" />
                      Attachment
                    </div>

                    {ticket.attachment_path ? (
                      <div className="mt-4 space-y-4">
                        {isImageAttachment(ticket.attachment_path) ? (
                          <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 dark:border-slate-700">
                            <img src={attachmentUrl} alt={attachmentName} className="h-52 w-full object-cover" />
                          </div>
                        ) : null}
                        <a href={attachmentUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full justify-center">
                          <DownloadIcon className="h-4 w-4" />
                          Download {attachmentName}
                        </a>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">No file was attached to this inquiry.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            <div className="space-y-6">
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Ticket snapshot</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">A quick summary of the current state, ownership, and response target.</p>
                  </div>
                </div>

                <div className="mt-7 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="rounded-3xl border border-slate-200 px-5 py-5 dark:border-slate-700">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Requester Email</div>
                    <div className="mt-3 break-all font-medium text-slate-900 dark:text-white">{ticket.user_email}</div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 px-5 py-5 dark:border-slate-700">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current Status</div>
                    <div className="mt-4"><StatusBadge status={ticket.status} /></div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 px-5 py-5 dark:border-slate-700">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current Priority</div>
                    <div className="mt-4"><PriorityBadge priority={ticket.priority} /></div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 px-5 py-5 dark:border-slate-700">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Comments</div>
                    <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{comments.length}</div>
                  </div>
                </div>
              </motion.section>

              {isAdmin ? (
                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-7">
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Quick admin controls</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Changes are saved immediately, update the SLA automatically, and appear in the activity timeline.</p>
                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Status</label>
                      <select
                        className="input-control"
                        value={ticket.status}
                        onChange={(event) => handleAdminUpdate("status", event.target.value)}
                        disabled={savingField === "status"}
                      >
                        {statusOptions.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>{statusOption}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Priority</label>
                      <select
                        className="input-control"
                        value={ticket.priority}
                        onChange={(event) => handleAdminUpdate("priority", event.target.value)}
                        disabled={savingField === "priority"}
                      >
                        {priorityOptions.map((priorityOption) => (
                          <option key={priorityOption} value={priorityOption}>{priorityOption}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.section>
              ) : (
                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-7">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Notification behavior</h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        You receive an email when the inquiry is submitted and whenever an admin changes the ticket status.
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}
            </div>
          </div>

          <div className="grid gap-8 2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <TicketComments
              comments={comments}
              commentText={commentText}
              onCommentChange={setCommentText}
              onCommentSubmit={handleCommentSubmit}
              sending={sendingComment}
            />
            <TicketTimeline logs={activityLogs} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default TicketDetails;