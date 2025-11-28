import React, { useState, useContext } from 'react'; // Added useContext import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './Components/Homepage.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Footer from './Components/Footer.jsx';
import Header from './Components/Header.jsx';
import Bookings from './Components/Bookings.jsx';

import SignInModal from './Components/SignInModal.jsx';
import SignUpModal from './Components/SignUpModal.jsx';

import AccountPage from './Components/AccountPage.jsx';
import EditAccountPage from './Components/EditAccountPage.jsx';

import GuidePage from './Components/GuidePage.jsx';

import { UserProvider, UserContext } from './Components/UserContext'; // Added UserContext import
import './App.css';

// Create a separate component that uses the UserContext
function AppContent() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Use UserContext inside UserProvider
  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = !!user;

  const handleSignInClick = () => setShowSignIn(true);
  const handleSignUpClick = () => setShowSignUp(true);

  const openSignIn = () => setShowSignIn(true);
  const openSignUp = () => setShowSignUp(true);

  const closeSignIn = () => setShowSignIn(false);
  const closeSignUp = () => setShowSignUp(false);

  const handleLogout = () => {
    setUser(null); // Clear user in context
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
    
    const logoutEvent = new Event('loginStatusChange');
    window.dispatchEvent(logoutEvent);
  };

  // Function to open login modal from child components
  const handleOpenLoginModal = () => {
    setShowSignIn(true);
  };

  return (
    <Router>
      <div className="page-wrapper">
        {/* HEADER */}
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onSignInClick={handleSignInClick}
          onSignUpClick={handleSignUpClick}
        />

        {/* MAIN CONTENT */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />         
            <Route path="/venues/*" element={
              <Dashboard onOpenLoginModal={handleOpenLoginModal} />
            } />  
            <Route path="/bookings/*" element={<Bookings />} />  
            <Route path="/faq" element={<div>FAQ Coming Soon...</div>} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/edit" element={<EditAccountPage />} />
            <Route path="/guide" element={<GuidePage />} />
          </Routes>
        </div>

        {/* FOOTER */}
        <Footer />

        {/* SIGN IN MODAL */}
        {showSignIn && (
          <SignInModal
            onClose={closeSignIn}
            setUser={setUser} // Pass setUser instead of setIsLoggedIn
            openSignUp={() => {
              closeSignIn();
              openSignUp();
            }}
          />
        )}

        {/* SIGN UP MODAL */}
        {showSignUp && (
          <SignUpModal
            onClose={closeSignUp}
            openSignIn={() => {
              closeSignUp();
              openSignIn();
            }}
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;