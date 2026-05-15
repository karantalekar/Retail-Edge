import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  // console.log(
  //   "PrivateRoute - Token check:",
  //   token ? "Token found" : "No token",
  // ); // debugging
  // console.log("PrivateRoute - Allowed roles:", allowedRoles);

  // 🔒 Step 1: Check if token exists
  if (!token) {
    alert("Access Denied: Please log in first!");
    return <Navigate to="/Login" replace />;
  }

  try {
    // 🧠 Step 2: Decode token
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // console.log("PrivateRoute - Decoded role:", userRole); // debugging

    // 🧾 Step 3: Check role-based access
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      alert("Access Denied: You do not have permission to view this page!");
      return <Navigate to="/" replace />;
    }

    // console.log("PrivateRoute - Access granted!"); // debugging
    return children;
  } catch (error) {
    console.error(error);
    alert("Invalid or expired token. Please log in again.");
    localStorage.removeItem("token");
    return <Navigate to="/Login" replace />;
  }
};

export default PrivateRoute;
