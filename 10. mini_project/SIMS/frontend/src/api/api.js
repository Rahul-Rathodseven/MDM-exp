import apiClient from "../services/apiClient";
import { loginRequest, registerRequest } from "../services/authService";
import {
  createInquiryRequest,
  getAllTicketsRequest,
  getUserTicketsRequest,
  updateTicketStatusRequest
} from "../services/ticketService";

export const loginUser = loginRequest;
export const registerUser = registerRequest;
export const createInquiry = createInquiryRequest;
export const getUserTickets = getUserTicketsRequest;
export const getAllTickets = getAllTicketsRequest;
export const updateTicketStatus = updateTicketStatusRequest;

export default apiClient;
