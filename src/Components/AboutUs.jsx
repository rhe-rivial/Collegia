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

      {/* Hero Section with image */}
      <div className="aboutus-hero">
        <img src="/images/school.jpg" alt="" className="aboutus-hero-img" />
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
            <div className="aboutus-image-name">Brye Sy</div>
          </div>

          <div className="aboutus-image-slot">
            <img src="/images/tupas.png" alt="Niña Tupas" />
            <div className="aboutus-image-name">Niña Tupas</div>
          </div>

          <div className="aboutus-image-slot">
            <img src="/images/hisoler.jpg" alt="Rhegynne Hisoler" />
            <div className="aboutus-image-name">Rhegynne Hisoler</div>
          </div>
        </div>

      </div>

      <button className="back-button" onClick={() => navigate("/")}>← Back to Homepage</button>
    </div>
  );
}