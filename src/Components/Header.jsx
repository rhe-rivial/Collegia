import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import CustomModal from "./CustomModal";
import "../styles/Header.css";

export default function Header({ isLoggedIn, onLogout, onSignInClick, onSignUpClick }) {
  const navigate = useNavigate();
  const { logout, user } = useContext(UserContext);

  // Modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // scrolling downward
        setIsHidden(true);
      } else {
        // scrolling upward
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  // Check if user is a custodian - handle both cases
  const isCustodian = user && (user.userType === 'CUSTODIAN' || user.userType === 'Custodian');

  // Debug logging
  console.log('🔵 Header - Props isLoggedIn:', isLoggedIn);
  console.log('🔵 Header - Context user:', user);
  console.log('🔵 Header - Context user ID:', user?.userId);
  console.log('🔵 Header - User type:', user?.userType);
  console.log('🔵 Header - Is custodian:', isCustodian);

  const handleLogout = () => {
    console.log('🟡 Header - Logout initiated');
    setModalMessage("Are you sure you want to log out?");
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    console.log('🔴 Header - Logout confirmed');
    onLogout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleVenuesNavigation = () => {
    if (isCustodian) {
      navigate("/custodian/dashboard");
    } else {
      navigate("/venues");
    }
  };

  return (
    <header className={`header ${isHidden ? "hidden" : ""}`}>
      <div className="header-left" onClick={() => navigate("/")}>
        <img src="/images/collegia-logo.png" alt="Collegia Logo" className="logo" />
        <h1 className="brand-name">Collegia</h1>
      </div>

      <nav className="nav-links">
        <button className="nav-item" onClick={() => navigate("/")}>Home</button>
        
        {/* Show either "Venues" or "Manage Venues" based on user role */}
        <button className="nav-item" onClick={handleVenuesNavigation}>
          {isCustodian ? "Manage Venues" : "Venues"}
        </button>
        
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