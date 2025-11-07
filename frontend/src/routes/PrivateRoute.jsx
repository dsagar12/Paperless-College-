import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ role, children }) => {
  const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated");

  if (role === "admin" && !isAdminAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default PrivateRoute;
