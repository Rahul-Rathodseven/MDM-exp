import { API_BASE_URL } from "../services/apiClient";

export const buildBackendAssetUrl = (path) => {
  if (!path) {
    return "";
  }

  return new URL(path, API_BASE_URL).toString();
};