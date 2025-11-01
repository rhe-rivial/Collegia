import React, { useState } from 'react';
import Homepage from './Components/Homepage.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Footer from './Components/Footer.jsx';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div className="page-wrapper">
        <div className="main-content">
          <Dashboard />
          {/* <Homepage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
