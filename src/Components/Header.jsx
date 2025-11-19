import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import CustomModal from "./CustomModal";
import "../styles/Header.css";

export default function Header({ isLoggedIn, onLogout, onSignInClick, onSignUpClick }) {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

  // Modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleLogout = () => {
    setModalMessage("Are you sure you want to log out?");
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    onLogout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

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
        {!isLoggedIn && (
          <>
            <button className="btn-signin" onClick={onSignInClick}>Sign In</button>
            <button className="btn-signup" onClick={onSignUpClick}>Sign Up</button>
          </>
        )}

        {isLoggedIn && (
          <>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
            <button className="profile-btn" onClick={() => navigate("/account")}>
              <img src="/images/default-profile.jpg" alt="Profile" className="profile-icon" />
            </button>
          </>
        )}
      </div>

      {/* --- Custom Logout Modal --- */}
      <CustomModal
        isOpen={showLogoutModal}
        message={modalMessage}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
        isConfirmOnly={false}
      />
    </header>
  );
}
