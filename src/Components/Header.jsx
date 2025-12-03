import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import CustomModal from "./CustomModal";
import "../styles/Header.css";

export default function Header({ isLoggedIn, onLogout, onSignInClick, onSignUpClick, toggleAdminSidebar }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate("/")}>
        <img src="/images/collegia-logo.png" alt="Collegia" className="logo" />
        <h1 className="brand-name">Collegia</h1>
      </div>

      <nav className="nav-links">
        <button className="nav-item" onClick={() => navigate("/")}>Home</button>
        <button className="nav-item" onClick={() => navigate("/venues")}>Venues</button>
        <button className="nav-item" onClick={() => navigate("/faq")}>FAQ</button>
      </nav>

      <div className="header-buttons">
        {/* ADMIN TOGGLE BUTTON */}
        {user?.role === "admin" && (
          <button className="admin-toggle-btn" onClick={toggleAdminSidebar}>
            ☰ Admin
          </button>
        )}

        {!isLoggedIn && (
          <>
            <button className="btn-signin" onClick={onSignInClick}>Sign In</button>
            <button className="btn-signup" onClick={onSignUpClick}>Sign Up</button>
          </>
        )}

        {isLoggedIn && (
          <>
            <button className="btn-logout" onClick={onLogout}>Logout</button>
            <button className="profile-btn" onClick={() => navigate("/account")}>
              <img src="/images/default-profile.jpg" className="profile-icon" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
