import React from "react";
import "../styles/GuidePage.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function GuidePage() {
  const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  
  return (
    <div className="guide-page">

      <h1 className="guide-title">Venue Booking Guide</h1>
      <p className="guide-subtitle">A simple step-by-step walkthrough on how to reserve a venue.</p>

      <div className="guide-steps">

        {/* Step 1 */}
        <div className="guide-step">
          <img src="/icons/guide-browse.svg" className="step-icon" />
          <div>
            <h2>Step 1: Browse Venues</h2>
            <p>View venue photos, descriptions, locations, and amenities to choose the perfect space for your event.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="guide-step">
          <img src="/icons/guide-request.svg" className="step-icon" />
          <div>
            <h2>Step 2: Submit a Booking Request</h2>
            <p>Select your preferred date and time and provide event details. The system checks availability instantly.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="guide-step">
          <img src="/icons/guide-track.svg" className="step-icon" />
          <div>
            <h2>Step 3: Track Your Booking</h2>
            <p>Monitor your booking status inside your account — Pending to Approved to Completed.</p>
          </div>
        </div>

      </div>

      <button className="back-button" onClick={() => navigate(-1)}>← Back to Homepage</button>

    </div>
  );
}
