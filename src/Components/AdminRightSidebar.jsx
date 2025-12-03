// AdminRightSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminRightSidebar.css";

export default function AdminRightSidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      
      {/* Arrow toggle attached to the sidebar */}
      <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? "›" : "‹"}
      </button>


      <h2 className="admin-title">Admin Panel</h2>

      <ul className="admin-menu">
        <li onClick={() => navigate("/admin/dashboard")}>📊 Dashboard</li>
        <li onClick={() => navigate("/admin/users")}>👥 User Management</li>
        <li onClick={() => navigate("/admin/venues")}>🏛️ Venue Management</li>
        <li onClick={() => navigate("/admin/bookings")}>📝 Booking Requests</li>
        <li onClick={() => navigate("/admin/analytics")}>📈 Analytics</li>
      </ul>

    </div>
  );
}
