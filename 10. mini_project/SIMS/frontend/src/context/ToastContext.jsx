import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type, title, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, type, title, message }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const value = useMemo(
    () => ({
      toasts,
      removeToast,
      success: (title, message) => showToast("success", title, message),
      error: (title, message) => showToast("error", title, message),
      info: (title, message) => showToast("info", title, message)
    }),
    [removeToast, showToast, toasts]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};
