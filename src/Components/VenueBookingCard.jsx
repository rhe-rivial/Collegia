import React, { useState } from "react";
import "../styles/VenueDetails.css";
import BookingForm from "./BookingForm.jsx";

export default function VenueBookingCard({ venueId }) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  

  const getVenueData = () => {
    // TEMPORARY
    const venuesData = [
      // NGE
      { id: 1, title: "NGE 101", image: "/images/Dining-room.jpg", tag: "NGE" },
      { id: 2, title: "NGE Hall A", image: "/images/Dining-room.jpg", tag: "NGE" },
      { id: 3, title: "NGE Hall B", image: "/images/Dining-room.jpg", tag: "NGE" },

      // SAL
      { id: 7, title: "Aurora Hall", image: "/images/Dining-room.jpg", tag: "SAL" },
      { id: 8, title: "SAL Main Hall", image: "/images/Dining-room.jpg", tag: "SAL" },
      { id: 9, title: "SAL Conference", image: "/images/Dining-room.jpg", tag: "SAL" },
      { id: 10, title: "SAL Lounge", image: "/images/Dining-room.jpg", tag: "SAL" },

      // GLE
      { id: 13, title: "Skyline Lounge", image: "/images/Dining-room.jpg", tag: "GLE" },
      { id: 14, title: "GLE Hall A", image: "/images/Dining-room.jpg", tag: "GLE" },
      { id: 15, title: "GLE Hall B", image: "/images/Dining-room.jpg", tag: "GLE" },
      { id: 16, title: "GLE Garden", image: "/images/Dining-room.jpg", tag: "GLE" },

      // Court
      { id: 19, title: "Court Pavilion", image: "/images/Dining-room.jpg", tag: "Court" },
      { id: 20, title: "Court Hall A", image: "/images/Dining-room.jpg", tag: "Court" },
      { id: 21, title: "Court Hall B", image: "/images/Dining-room.jpg", tag: "Court" },

      // ACAD
      { id: 25, title: "ACAD Hall", image: "/images/Dining-room.jpg", tag: "ACAD" },
      { id: 26, title: "ACAD Conference", image: "/images/Dining-room.jpg", tag: "ACAD" },
      { id: 27, title: "ACAD Lounge", image: "/images/Dining-room.jpg", tag: "ACAD" },

      // More
      { id: 31, title: "More Venue 1", image: "/images/Dining-room.jpg", tag: "More" },
      { id: 32, title: "More Venue 2", image: "/images/Dining-room.jpg", tag: "More" },
      { id: 33, title: "More Venue 3", image: "/images/Dining-room.jpg", tag: "More" },
      { id: 34, title: "More Venue 4", image: "/images/Dining-room.jpg", tag: "More" },
    ];
    return venuesData.find(venue => venue.id === venueId) || { title: "Unknown Venue", image: "/images/Dining-room.jpg" };
  };

  const venueData = getVenueData();

  const handleBookNow = () => {
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleVenueInquiry = () => {
    console.log("Venue Inquiry clicked");
  };

  const handleContactHost = () => {
    console.log("Contact Host clicked");
  };

  return (
    <>
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
              <img src="/icons/contact.svg" alt="Contact Host" />
            </div>
            <span>Contact Host</span>
          </button>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <BookingForm 
              venueId={venueId}
              venueData={venueData}
              onClose={handleCloseBookingForm}
            />
          </div>
        </div>
      )}
    </>
  );
}