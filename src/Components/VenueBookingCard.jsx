import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/VenueDetails.css";

export default function VenueBookingCard() {
    // temporary
      const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/venues/venue/:id/BookingForm"); // Navigate to booking page
  };

  const handleVenueInquiry = () => {
    console.log("Venue Inquiry clicked");
    // Add inquiry logic here
  };

  const handleContactHost = () => {
    console.log("Contact Host clicked");
    // Add contact host logic here
  };

  return (
    <div className="venue-booking-card">
      <div className="booking-header">
        <h3>Hourly</h3>
      </div>
      
      <div className="pricing-section">
        <div className="pricing-tier">
          <span className="tier-title">1 - 6 hours</span>
        </div>
        
        <div className="divider"></div>
        
        <div className="pricing-details">
          <div className="pricing-item">
            <span className="period">Short Period: 1 - 2 hours</span>
          </div>
          <div className="pricing-item">
            <span className="period">Medium Period: 3 - 4 hours</span>
          </div>
          <div className="pricing-item">
            <span className="period">Long Period: 5 - 6 hours</span>
          </div>
        </div>
      </div>
      {/* goes to BookingForm */}
      <button className="book-now-button" onClick={handleBookNow}>
        Book Now
      </button>
      
      
      <div className="action-links">
        <button className="action-link" onClick={handleVenueInquiry}>
          <div className="link-icon inquiry-icon">
            <img src="/icons/office-building.svg" alt="Venue Inquiry" />
          </div>
          <span>Venue Inquiry</span>
        </button>
        
        <button className="action-link" onClick={handleContactHost}>
          <div className="link-icon contact-icon">
             <img src="/icons/contact.svg" alt="Venue Inquiry" />
          </div>
          <span>Contact Host</span>
        </button>
      </div>
    </div>
  );
}