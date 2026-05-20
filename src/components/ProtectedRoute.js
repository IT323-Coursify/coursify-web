import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("coursify_role");

  if (!token) return <Navigate to="/" replace />;
  if (requiredRole && role !== requiredRole && role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}