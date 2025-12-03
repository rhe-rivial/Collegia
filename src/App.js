import React, { useState, useContext } from 'react';
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

import { UserProvider, UserContext } from './Components/UserContext';
import './App.css';
import FAQ from './Components/FAQ.jsx';

// Admin components
import AdminRightSidebar from "./Components/AdminRightSidebar.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
import UserManagement from "./Components/UserManagement.jsx";
import VenueManagement from "./Components/VenueManagement.jsx";
import BookingRequests from "./Components/BookingRequests.jsx";
import Analytics from "./Components/Analytics.jsx";

function AppContent() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showAdminSidebar, setShowAdminSidebar] = useState(true);

  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = !!user;

  const isAdmin = user?.userType?.toLowerCase() === "admin";

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <Router>
      <div className="page-wrapper">

        {/* Header */}
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onSignInClick={() => setShowSignIn(true)}
          onSignUpClick={() => setShowSignUp(true)}
        />

        {/* ADMIN SIDEBAR (ONLY IF ADMIN) */}
        {isAdmin && (
          <AdminRightSidebar
            isOpen={showAdminSidebar}
            toggleSidebar={() => setShowAdminSidebar(!showAdminSidebar)}
          />
        )}

        <div className="main-content">

          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Homepage />} />
            <Route path="/venues/*" element={<Dashboard />} />
            <Route path="/bookings/*" element={<Bookings />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/edit" element={<EditAccountPage />} />
            <Route path="/guide" element={<GuidePage />} />

            {/* ADMIN ROUTES */}
            {isAdmin && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/venues" element={<VenueManagement />} />
                <Route path="/admin/bookings" element={<BookingRequests />} />
                <Route path="/admin/analytics" element={<Analytics />} />
              </>
            )}
          </Routes>
        </div>

        <Footer />

        {/* SIGN IN MODAL */}
        {showSignIn && (
          <SignInModal
            onClose={() => setShowSignIn(false)}
            openSignUp={() => {
              setShowSignIn(false);
              setShowSignUp(true);
            }}
          />
        )}

        {/* SIGN UP MODAL */}
        {showSignUp && (
          <SignUpModal
            onClose={() => setShowSignUp(false)}
            openSignIn={() => {
              setShowSignUp(false);
              setShowSignIn(true);
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
