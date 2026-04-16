import { motion } from "framer-motion";
import { useState } from "react";
import { MailIcon, PaperclipIcon } from "../components/AppIcons";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createInquiryRequest } from "../services/ticketService";

const initialState = {
  subject: "",
  message: "",
  category: "General"
};

const SubmitInquiry = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState(initialState);
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [latestTicket, setLatestTicket] = useState(null);

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("user_id", user.id);
      payload.append("subject", formData.subject);
      payload.append("message", formData.message);
      payload.append("category", formData.category);
      if (attachment) {
        payload.append("attachment", attachment);
      }

      const response = await createInquiryRequest(payload);
      setLatestTicket(response.ticket);
      setFormData(initialState);
      setAttachment(null);
      toast.success("Inquiry submitted", `Ticket #${response.ticket.ticket_id} has been created.`);
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Submission failed", requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="page-stack">
      <section className="hero-panel">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_380px] xl:items-end">
          <div className="max-w-4xl">
            <p className="section-title">New Inquiry</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white xl:text-5xl">Create a request with enough clarity for quick action.</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 dark:text-slate-400 xl:text-lg">
              Use the full form below to capture the issue clearly, reduce back-and-forth, and help your support team respond with context from the start.
            </p>
          </div>
          <div className="metric-strip">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Default routing</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <StatusBadge status="Open" />
              <PriorityBadge priority="Medium" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              New inquiries start in the open queue, get an SLA deadline automatically, and can include one attachment.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 2xl:grid-cols-[minmax(0,1.35fr)_420px]">
        <div className="glass-panel rounded-[2rem] p-8 lg:p-10 xl:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Subject</label>
                <input className="input-control" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Short summary of the issue" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Category</label>
                <select className="input-control" name="category" value={formData.category} onChange={handleChange}>
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Billing">Billing</option>
                  <option value="Account">Account</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Message</label>
              <textarea className="input-control min-h-[280px] resize-none" name="message" value={formData.message} onChange={handleChange} placeholder="Describe your inquiry with enough detail for support to help effectively." required></textarea>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Attachment</label>
              <label className="flex cursor-pointer flex-col gap-3 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-5 text-sm text-slate-500 transition hover:border-primary-300 hover:bg-primary-50/40 dark:border-slate-700 dark:bg-slate-950/35 dark:text-slate-400 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/5">
                <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                  <PaperclipIcon className="h-4 w-4" />
                  Upload one file
                </span>
                <span>Supported: JPG, PNG, GIF, PDF, DOC, DOCX, TXT up to 5MB.</span>
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
              </label>
              {attachment ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <PaperclipIcon className="h-3.5 w-3.5" />
                  {attachment.name}
                </div>
              ) : null}
            </div>
            {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</p> : null}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">A confirmation email will be sent after the ticket is created.</p>
              <button className="btn-primary min-w-[180px]" disabled={loading} type="submit">{loading ? "Submitting..." : "Create Ticket"}</button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-8">
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">What makes a strong inquiry?</h3>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              <p>Use a precise subject that someone scanning a queue can understand in seconds.</p>
              <p>Choose the category that best matches the request to speed up assignment.</p>
              <p>Include concrete details, recent actions, and the outcome you expected.</p>
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                <MailIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Submission status</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Every new inquiry starts in the queue with an Open status and Medium priority.</p>
              </div>
            </div>

            {latestTicket ? (
              <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                <div className="font-semibold">Latest created ticket: #{latestTicket.ticket_id}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={latestTicket.status} />
                  <PriorityBadge priority={latestTicket.priority} />
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm leading-7 text-slate-500 dark:text-slate-400">
                SIMS sends a basic email notification when the inquiry is submitted and again whenever the ticket status changes.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubmitInquiry;