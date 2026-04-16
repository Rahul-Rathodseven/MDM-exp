import axios from "axios";

export const API_BASE_URL = "http://localhost:8000";
export const API_URL = `${API_BASE_URL}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;