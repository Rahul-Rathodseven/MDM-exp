import apiClient from "./apiClient";

export const createInquiryRequest = async (payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await apiClient.post("/create_inquiry.php", payload, isFormData ? {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  } : undefined);
  return data;
};

export const getUserTicketsRequest = async (userId) => {
  const { data } = await apiClient.get(`/get_user_tickets.php?user_id=${userId}`);
  return data;
};

export const getAllTicketsRequest = async (adminUserId) => {
  const { data } = await apiClient.get(`/get_all_tickets.php?admin_user_id=${adminUserId}`);
  return data;
};

export const getTicketDetailsRequest = async ({ ticketId, userId, adminUserId }) => {
  const params = new URLSearchParams({ ticket_id: ticketId });

  if (userId) {
    params.set("user_id", userId);
  }

  if (adminUserId) {
    params.set("admin_user_id", adminUserId);
  }

  const { data } = await apiClient.get(`/get_ticket_details.php?${params.toString()}`);
  return data;
};

export const getCommentsRequest = async ({ ticketId, userId, adminUserId }) => {
  const params = new URLSearchParams({ ticket_id: ticketId });

  if (userId) {
    params.set("user_id", userId);
  }

  if (adminUserId) {
    params.set("admin_user_id", adminUserId);
  }

  const { data } = await apiClient.get(`/get_comments.php?${params.toString()}`);
  return data;
};

export const addCommentRequest = async (payload) => {
  const { data } = await apiClient.post("/add_comment.php", payload);
  return data;
};

export const updateTicketRequest = async (payload) => {
  const { data } = await apiClient.post("/update_ticket.php", payload);
  return data;
};

export const exportTicketsRequest = async ({ adminUserId, search = "", status = "All", priority = "All" }) => {
  const params = new URLSearchParams({ admin_user_id: adminUserId, search, status, priority });
  const response = await apiClient.get(`/export_tickets.php?${params.toString()}`, {
    responseType: "blob"
  });

  return response.data;
};

export const updateTicketStatusRequest = updateTicketRequest;