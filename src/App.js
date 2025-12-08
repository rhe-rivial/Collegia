import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import { UserProvider, UserContext } from './Components/UserContext'; // Added UserContext import
import './App.css';


import Homepage from "./Components/Homepage.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Footer from "./Components/Footer.jsx";
import Header from "./Components/Header.jsx";
import Bookings from "./Components/Bookings.jsx";
import AboutUs from "./Components/AboutUs.jsx";

import SignInModal from "./Components/SignInModal.jsx";
import SignUpModal from "./Components/SignUpModal.jsx";

import AccountPage from "./Components/AccountPage.jsx";
import EditAccountPage from "./Components/EditAccountPage.jsx";
import GuidePage from "./Components/GuidePage.jsx";

// custodian components
import CustodianVenues from './Components/CustodianVenues.jsx'; 
import AddVenuePage from './Components/AddVenuePage.jsx'; 

import FAQ from "./Components/FAQ.jsx";
import AdminRightSidebar from "./Components/AdminRightSidebar.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
import UserManagement from "./Components/UserManagement.jsx";
import VenueManagement from "./Components/VenueManagement.jsx";
import BookingRequests from "./Components/BookingRequests.jsx";
import Analytics from "./Components/Analytics.jsx";
import ProtectedAdminRoute from "./Components/ProtectedAdminRoute.jsx";
import CustodianRightSidebar from "./Components/CustodianRightSidebar.jsx";
import CustodianBookings from "./Components/CustodianBookings.jsx";
import CustodianDashboard from "./Components/CustodianDashboard.jsx";

function AppContent() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, setUser } = useContext(UserContext); 
  const [showAdminSidebar, setShowAdminSidebar] = useState(true);
  const [showCustodianSidebar, setShowCustodianSidebar] = useState(true);

  const isLoggedIn = !!user;
  const isAdmin = user?.userType?.toLowerCase() === "admin";
  const isCustodian = user?.userType?.toLowerCase() === "custodian";

  // Redirect user if they are not admin while inside admin routes
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

      <div className="content-wrapper">
        {/* ADMIN SIDEBAR (only visible for admin) */}
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

        {/* MAIN CONTENT */}
        <main className="main-content">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Homepage />} />
            
            {/* VENUES ROUTE */}
            <Route path="/venues/*" element={
              <Dashboard onOpenLoginModal={handleOpenLoginModal} />
            } />
            
            {/* BOOKINGS ROUTES */}
            <Route path="/bookings/*" element={<Bookings />} />
            <Route path="/custodian/bookings/*" element={<CustodianBookings />} />
            
            {/* USER ROUTES */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/edit" element={<EditAccountPage />} />
            
            {/* INFORMATION ROUTES */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/guide" element={<GuidePage />} />
            
            {/* CUSTODIAN ROUTES */}
            <Route path="/custodian/dashboard" element={<CustodianDashboard />} />
            <Route path="/custodian/my-venues" element={<CustodianVenues />} />
            <Route path="/custodian/add-venue" element={<AddVenuePage />} />

            {/* ADMIN ROUTES */}
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
        </main>
      </div>

      {/* FOOTER */}
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