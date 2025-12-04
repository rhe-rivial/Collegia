import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Homepage from "./Components/Homepage.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Footer from "./Components/Footer.jsx";
import Header from "./Components/Header.jsx";
import Bookings from "./Components/Bookings.jsx";

import SignInModal from "./Components/SignInModal.jsx";
import SignUpModal from "./Components/SignUpModal.jsx";

import AccountPage from "./Components/AccountPage.jsx";
import EditAccountPage from "./Components/EditAccountPage.jsx";
import GuidePage from "./Components/GuidePage.jsx";

import { UserProvider, UserContext } from './Components/UserContext';
import './App.css';
import CustodianDashboard from './Components/CustodianDashboard.jsx';

import FAQ from "./Components/FAQ.jsx";
import AdminRightSidebar from "./Components/AdminRightSidebar.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
import UserManagement from "./Components/UserManagement.jsx";
import VenueManagement from "./Components/VenueManagement.jsx";
import BookingRequests from "./Components/BookingRequests.jsx";
import Analytics from "./Components/Analytics.jsx";
import ProtectedAdminRoute from "./Components/ProtectedAdminRoute.jsx";
import CustodianRightSidebar from "./Components/CustodianRightSidebar.jsx";

function AppContent() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showAdminSidebar, setShowAdminSidebar] = useState(true);
  const [showCustodianSidebar, setShowCustodianSidebar] = useState(true);

  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = !!user;
  const isAdmin = user?.userType?.toLowerCase() === "admin";
  const isCustodian = user?.userType?.toLowerCase() === "custodian";

  // redirect if not admin anymore
  useEffect(() => {
    if (!isAdmin) {
      setShowAdminSidebar(false);
    }
    if (isCustodian) {
      setShowCustodianSidebar(true);
    } else {
      setShowCustodianSidebar(false);
    }
  }, [isAdmin, isCustodian, navigate]);

  // LOGOUT FIX
  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    setShowAdminSidebar(false);
    setShowCustodianSidebar(false);
    navigate("/", { replace: true });
  };

  // Add this missing function
  const handleOpenLoginModal = () => {
    setShowSignIn(true);
  };

  return (
    <div className="page-wrapper">
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSignInClick={() => setShowSignIn(true)}
        onSignUpClick={() => setShowSignUp(true)}
      />

      {isAdmin && (
        <AdminRightSidebar
          isOpen={showAdminSidebar}
          toggleSidebar={() => setShowAdminSidebar(!showAdminSidebar)}
        />
      )}

      {isCustodian && (
        <CustodianRightSidebar
          isOpen={showCustodianSidebar}
          toggleSidebar={() => setShowCustodianSidebar(!showCustodianSidebar)}
        />
      )}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          
          <Route path="/venues/*" element={
            <Dashboard onOpenLoginModal={handleOpenLoginModal} />
          } />
          
          <Route path="/bookings/*" element={<Bookings />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/edit" element={<EditAccountPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/custodian/dashboard" element={<CustodianDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedAdminRoute>
              <UserManagement />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/venues" element={
            <ProtectedAdminRoute>
              <VenueManagement />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedAdminRoute>
              <BookingRequests />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedAdminRoute>
              <Analytics />
            </ProtectedAdminRoute>
          } />
        </Routes>
      </div>

      <Footer />

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          openSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
        />
      )}

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
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;