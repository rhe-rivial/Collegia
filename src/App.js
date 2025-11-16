import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './Components/Homepage.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Footer from './Components/Footer.jsx';
import Header from './Components/Header.jsx';

import SignInModal from './Components/SignInModal.jsx';
import SignUpModal from './Components/SignUpModal.jsx';

import AccountPage from './Components/AccountPage.jsx';
import EditAccountPage from './Components/EditAccountPage.jsx';

import './App.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => setShowSignIn(true);
  const handleSignUpClick = () => setShowSignUp(true);

  const openSignIn = () => setShowSignIn(true);
  const openSignUp = () => setShowSignUp(true);

  const closeSignIn = () => setShowSignIn(false);
  const closeSignUp = () => setShowSignUp(false);

  return (
    <Router>
      <div className="page-wrapper">

        {/* HEADER */}
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={() => setIsLoggedIn(false)} 
          onSignInClick={handleSignInClick}
          onSignUpClick={handleSignUpClick}
        />

        {/* MAIN CONTENT */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />         
            <Route path="/venues/*" element={<Dashboard />} />   
            <Route path="/faq" element={<div>FAQ Coming Soon...</div>} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/edit" element={<EditAccountPage />} />
          </Routes>
        </div>

        {/* FOOTER */}
        <Footer />

        {/* SIGN IN MODAL */}
        {showSignIn && (
          <SignInModal
            onClose={closeSignIn}
            setIsLoggedIn={setIsLoggedIn}
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

export default App;
