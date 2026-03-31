// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;