import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function ProtectedAdminRoute({ children }) {
  const { user } = useContext(UserContext);

  // If not logged in OR not admin
  if (!user || user.userType !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
