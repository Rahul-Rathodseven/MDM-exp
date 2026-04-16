export const filterTickets = (tickets, { search = "", status = "All", priority = "All" }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return tickets.filter((ticket) => {
    const matchesStatus = status === "All" || ticket.status === status;
    const matchesPriority = priority === "All" || ticket.priority === priority;

    if (!normalizedSearch) {
      return matchesStatus && matchesPriority;
    }

    const searchableFields = [
      ticket.id,
      ticket.subject,
      ticket.message,
      ticket.category,
      ticket.status,
      ticket.priority,
      ticket.user_name,
      ticket.user_email
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && matchesPriority && searchableFields.includes(normalizedSearch);
  });
};