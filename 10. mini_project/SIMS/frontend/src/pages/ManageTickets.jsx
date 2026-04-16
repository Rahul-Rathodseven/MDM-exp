import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExportIcon } from "../components/AppIcons";
import TicketFilters from "../components/TicketFilters";
import TicketTable from "../components/TicketTable";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { exportTicketsRequest, getAllTicketsRequest, updateTicketRequest } from "../services/ticketService";
import { filterTickets } from "../utils/filterTickets";

const statusOptions = ["Open", "In Progress", "Closed"];
const priorityOptions = ["Low", "Medium", "High"];

const ManageTickets = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const debouncedSearch = useDebouncedValue(search, 250);

  const loadTickets = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const response = await getAllTicketsRequest(user.id);
      setTickets(response.tickets || []);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user.id]);

  const handleTicketUpdate = async (ticketId, patch, successMessage) => {
    setSavingId(ticketId);
    setError("");

    try {
      await updateTicketRequest({ ticket_id: ticketId, admin_user_id: user.id, ...patch });
      toast.success("Ticket updated", successMessage);
      await loadTickets(false);
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Update failed", requestError.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError("");

    try {
      const csvBlob = await exportTicketsRequest({
        adminUserId: user.id,
        search: debouncedSearch,
        status,
        priority
      });

      const blobUrl = window.URL.createObjectURL(csvBlob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `sims-ticket-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Export complete", "The filtered ticket report has been downloaded.");
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Export failed", requestError.message);
    } finally {
      setExporting(false);
    }
  };

  const filteredTickets = filterTickets(tickets, {
    search: debouncedSearch,
    status,
    priority
  });

  return (
    <div className="page-stack">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="hero-panel">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_360px] xl:items-end">
          <div className="max-w-4xl">
            <p className="section-title">Manage Tickets</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white xl:text-5xl">A wider operations view for prioritizing and moving work</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 dark:text-slate-400 xl:text-lg">Review all requests, adjust both status and priority, monitor SLA health, and export filtered reports without leaving the queue view.</p>
          </div>
          <div className="metric-strip">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Filtered queue</p>
            <div className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">{filteredTickets.length}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Tickets currently visible with the active search and filter selection.</p>
            <button type="button" className="btn-primary mt-6 w-full justify-center" onClick={handleExport} disabled={exporting}>
              <ExportIcon className="h-4 w-4" />
              {exporting ? "Preparing CSV..." : "Export filtered CSV"}
            </button>
          </div>
        </div>
      </motion.section>

      <TicketFilters
        search={search}
        status={status}
        priority={priority}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        placeholder="Search by ticket, requester, or message"
        resultsCount={filteredTickets.length}
      />

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}

      <TicketTable
        tickets={filteredTickets}
        loading={loading}
        showUser
        emptyMessage="No admin tickets match the current filters."
        renderActions={(ticket) => (
          <div className="flex min-w-[250px] flex-col gap-3">
            <Link to={`/admin/tickets/${ticket.id}`} className="btn-secondary w-full whitespace-nowrap px-5 py-3">
              View details
            </Link>
            <select
              className="input-control py-3"
              value={ticket.status}
              onChange={(event) => handleTicketUpdate(ticket.id, { status: event.target.value }, `Ticket #${ticket.id} is now ${event.target.value}.`)}
              disabled={savingId === ticket.id}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>{statusOption}</option>
              ))}
            </select>
            <select
              className="input-control py-3"
              value={ticket.priority}
              onChange={(event) => handleTicketUpdate(ticket.id, { priority: event.target.value }, `Priority for ticket #${ticket.id} changed to ${event.target.value}.`)}
              disabled={savingId === ticket.id}
            >
              {priorityOptions.map((priorityOption) => (
                <option key={priorityOption} value={priorityOption}>{priorityOption}</option>
              ))}
            </select>
          </div>
        )}
      />
    </div>
  );
};

export default ManageTickets;