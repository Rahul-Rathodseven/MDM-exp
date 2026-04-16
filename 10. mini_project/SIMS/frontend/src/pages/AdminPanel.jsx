import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAllTickets, updateTicketStatus } from "../api/api";
import StatusBadge from "../components/StatusBadge";
import { getStoredUser } from "../utils/auth";

const statuses = ["Open", "In Progress", "Closed"];

const AdminPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = getStoredUser();

  const loadTickets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await getAllTickets(user.id);
      setTickets(response.data.tickets || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load admin tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleStatusChange = async (ticketId, status) => {
    setSavingId(ticketId);
    setError("");
    setSuccess("");

    try {
      await updateTicketStatus({
        ticket_id: ticketId,
        status,
        admin_user_id: user.id,
      });
      setSuccess(`Ticket #${ticketId} updated successfully.`);
      await loadTickets();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update ticket.");
    } finally {
      setSavingId(null);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review every ticket in the system and update statuses in real time.
          </p>
        </div>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="text-left text-sm font-semibold text-slate-500">
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {loading && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                  Loading tickets...
                </td>
              </tr>
            )}
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                  No tickets available.
                </td>
              </tr>
            )}
            {!loading &&
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-900">#{ticket.id}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{ticket.user_name}</div>
                    <div className="text-xs text-slate-500">{ticket.user_email}</div>
                  </td>
                  <td className="px-4 py-4">{ticket.subject}</td>
                  <td className="px-4 py-4">{ticket.category}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={ticket.status}
                      onChange={(event) => handleStatusChange(ticket.id, event.target.value)}
                      disabled={savingId === ticket.id}
                      className="rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-brand-500"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
