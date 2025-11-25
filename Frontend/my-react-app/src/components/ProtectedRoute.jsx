//internal gurad check token and role before showing page
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ roles }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);

    if (roles && !roles.includes(decoded.role)) {
      return <Navigate to="/dashboard" />; // unauthorized redirect
    }

    return <Outlet />; // allow nested routes
  } catch (err) {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
