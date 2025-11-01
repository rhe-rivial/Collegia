import React from "react";
import "../styles/VenueDetails.css";

export default function VenueBookingCard() {
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
      
      <button className="book-now-button">
        Book Now
      </button>
      
      <div className="action-links">
        <button className="action-link">
          <div className="link-icon inquiry-icon">
            <img src="/icons/office-building.svg" alt="Venue Inquiry" />
          </div>
          <span>Venue Inquiry</span>
        </button>
        
        <button className="action-link">
          <div className="link-icon contact-icon">
             <img src="/icons/contact.svg" alt="Venue Inquiry" />
          </div>
          <span>Contact Host</span>
        </button>
      </div>
    </div>
  );
}