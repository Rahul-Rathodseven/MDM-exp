import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, registerRequest } from "../services/authService";

const AuthContext = createContext(null);
const STORAGE_KEY = "sims-auth-session";

const isValidSessionUser = (value) => {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof value.id !== "undefined" &&
    typeof value.email === "string" &&
    typeof value.role === "string"
  );
};

const extractUserFromResponse = (response) => {
  if (isValidSessionUser(response?.user)) {
    return response.user;
  }

  if (isValidSessionUser(response)) {
    return response;
  }

  return null;
};

const parseStoredSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!isValidSessionUser(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(parseStoredSession);
  const [initializing] = useState(false);

  useEffect(() => {
    if (session && isValidSessionUser(session)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = async ({ email, password, expectedRole }) => {
    const response = await loginRequest({ email, password });
    const authenticatedUser = extractUserFromResponse(response);

    if (!authenticatedUser) {
      throw new Error("Authentication failed because the server returned an invalid user session.");
    }

    if (expectedRole && authenticatedUser.role !== expectedRole) {
      throw new Error(
        expectedRole === "admin"
          ? "This account does not have admin access."
          : "Please use a user account to continue."
      );
    }

    setSession(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    const registeredUser = extractUserFromResponse(response);

    if (!registeredUser) {
      throw new Error("Registration succeeded, but the server did not return a valid user session.");
    }

    setSession(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    setSession(null);
  };

  const value = useMemo(
    () => ({
      user: session,
      isAuthenticated: Boolean(session),
      initializing,
      login,
      register,
      logout
    }),
    [initializing, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};