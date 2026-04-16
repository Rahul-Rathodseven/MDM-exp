import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import TicketFilters from "../components/TicketFilters";
import TicketTable from "../components/TicketTable";
import { useAuth } from "../context/AuthContext";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { getUserTicketsRequest } from "../services/ticketService";
import { filterTickets } from "../utils/filterTickets";

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await getUserTicketsRequest(user.id);
        setTickets(response.tickets || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user.id]);

  const filteredTickets = filterTickets(tickets, {
    search: debouncedSearch,
    status,
    priority
  });

  return (
    <div className="page-stack">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="hero-panel">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_350px] xl:items-end">
          <div className="max-w-4xl">
            <p className="section-title">My Tickets</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white xl:text-5xl">Track every ticket with full-screen visibility and useful filters</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 dark:text-slate-400 xl:text-lg">Search across ticket content, narrow the list by status and priority, and open any ticket to review attachments, comments, SLA progress, and the full activity timeline.</p>
          </div>
          <div className="flex flex-wrap gap-3 xl:justify-end">
            <Link to="/submit-inquiry" className="btn-primary">Submit Another Inquiry</Link>
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
        placeholder="Search your tickets"
        resultsCount={filteredTickets.length}
      />

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}

      {!loading && tickets.length === 0 && !error ? (
        <EmptyState
          title="No tickets yet 🚀"
          description="Once you submit an inquiry, it will appear here with SLA tracking, comments, attachments, and timeline updates."
          action={<Link to="/submit-inquiry" className="btn-primary">Create your first ticket</Link>}
        />
      ) : (
        <TicketTable
          tickets={filteredTickets}
          loading={loading}
          emptyMessage="No tickets match your current filters."
          renderActions={(ticket) => (
            <Link to={`/my-tickets/${ticket.id}`} className="btn-secondary w-full whitespace-nowrap px-5 py-3">
              View details
            </Link>
          )}
        />
      )}
    </div>
  );
};

export default MyTickets;