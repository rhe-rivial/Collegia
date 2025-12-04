import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AdminRightSidebar.css";

export default function CustodianRightSidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      
      <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? "›" : "‹"}
      </button>

      <h2 className="admin-title">Custodian Panel</h2>

      <ul className="admin-menu">

        <li 
          className={isActive("/custodian/dashboard")}
          onClick={() => navigate("/custodian/dashboard")}
        >
           My Dashboard
        </li>

        <li 
          className={isActive("/custodian/venues")}
          onClick={() => navigate("/custodian/dashboard")}
        >
           My Venues
        </li>

        <li 
          className={isActive("/custodian/add-venue")}
          onClick={() => navigate("/custodian/dashboard")}
        >
           Add Venue
        </li>

        <li 
          className={isActive("/custodian/bookings")}
          onClick={() => navigate("/bookings")}
        >
           My Bookings
        </li>

        <li 
          className={isActive("/custodian/schedule")}
          onClick={() => navigate("/custodian/dashboard")}
        >
           Schedule
        </li>

      </ul>
    </div>
  );
}