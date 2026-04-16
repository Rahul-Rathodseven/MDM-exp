import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ManageTickets from "./pages/ManageTickets";
import MyTickets from "./pages/MyTickets";
import Register from "./pages/Register";
import SubmitInquiry from "./pages/SubmitInquiry";
import TicketDetails from "./pages/TicketDetails";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout variant="user" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<AuthLayout variant="admin" />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="submit-inquiry" element={<SubmitInquiry />} />
          <Route path="my-tickets" element={<MyTickets />} />
          <Route path="my-tickets/:ticketId" element={<TicketDetails />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tickets" element={<ManageTickets />} />
          <Route path="tickets/:ticketId" element={<TicketDetails isAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;