import React, { useEffect } from "react";
import "../styles/AboutUs.css";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="aboutus-page">

      {/* Hero Section with background image */}
      <div className="aboutus-hero">
        <h1 className="aboutus-hero-title">About Us</h1>
      </div>

      {/* Team Section */}
      <div className="aboutus-team">
        <p className="aboutus-description">
          This program was made by Brye Kane L. Sy, Niña Isabelle C. Tupas, and Rhegynne Leighlane M. Hisoler in the year 2025.
          It was born out of a need for students, coordinators, and faculty alike to be able to schedule rooms for usage in a
          relatively simple, convenient way that can be accessed remotely.
        </p>

        <div className="aboutus-image-row">
          <div className="aboutus-image-slot">
            <img src="/images/sy.jpg" alt="Brye Sy" />
          </div>

          <div className="aboutus-image-slot">
            <img src="/images/tupas.jpg" alt="Niña Tupas" />
          </div>

          <div className="aboutus-image-slot">
            <img src="/images/hisoler.jpg" alt="Rhegynne Hisoler" />
          </div>
          
        </div>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>← Back to Homepage</button>
    </div>
  );
}