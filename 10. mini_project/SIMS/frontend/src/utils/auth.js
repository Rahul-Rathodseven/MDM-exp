const STORAGE_KEY = "sims-auth-session";

export const readStoredSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const isAdminUser = (user) => user?.role === "admin";
export const isRegularUser = (user) => user?.role === "user";
export const authStorageKey = STORAGE_KEY;
