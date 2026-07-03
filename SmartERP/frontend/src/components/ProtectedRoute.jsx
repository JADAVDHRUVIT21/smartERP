import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Replace this with your actual authentication check
  const isAuthenticated = !!localStorage.getItem("token");
  console.log(localStorage.getItem("token"));

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;