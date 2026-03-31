import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminRoute() {
  const { authUser, isCheckingAuth } = useAuthStore();
  console.log("AdminRoute:", { authUser, isCheckingAuth });


  if (authUser.role !== "admin") return <Navigate to="/" />;

  return <Outlet />;
}
