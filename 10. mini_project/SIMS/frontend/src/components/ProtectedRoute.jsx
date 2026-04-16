import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();
  const hasValidRole = typeof user?.role === "string";

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Preparing your workspace" />
      </div>
    );
  }

  if (!user || !hasValidRole) {
    const loginPath = allowedRole === "admin" ? "/admin/login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;