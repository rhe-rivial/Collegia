import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header({ isLoggedIn, onLogout, onSignInClick, onSignUpClick }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate("/")}>
        <img src="/images/collegia-logo.png" alt="Collegia Logo" className="logo" />
        <h1 className="brand-name">Collegia</h1>
      </div>

      <nav className="nav-links">
        <button className="nav-item" onClick={() => navigate("/")}>Home</button>
        <button className="nav-item" onClick={() => navigate("/venues")}>Venues</button>
        <button className="nav-item" onClick={() => navigate("/faq")}>FAQ</button>
      </nav>

      <div className="header-buttons">

        {/* IF LOGGED OUT → Show Sign In + Sign Up */}
        {!isLoggedIn && (
          <>
            <button className="btn-signin" onClick={onSignInClick}>Sign In</button>
            <button className="btn-signup" onClick={onSignUpClick}>Sign Up</button>
          </>
        )}

        {/* IF LOGGED IN → Show Logout + Profile icon */}
        {isLoggedIn && (
          <>
            <button className="btn-logout" onClick={onLogout}>Logout</button>
            <button className="profile-btn">
              <img src="/images/profile-icon.png" alt="Profile" className="profile-icon" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
