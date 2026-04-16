import apiClient from "./apiClient";

export const registerRequest = async (payload) => {
  const { data } = await apiClient.post("/register.php", payload);
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await apiClient.post("/login.php", payload);
  return data;
};
