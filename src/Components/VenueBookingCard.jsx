import React, { useState, useEffect } from "react";
import "../styles/VenueDetails.css";
import BookingForm from "./BookingForm.jsx";

export default function VenueBookingCard({ venueId }) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch specific venue data
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/venues/${venueId}`);
        if (response.ok) {
          const venueFromApi = await response.json();
          setVenueData(venueFromApi);
        } else {
          // Fallback data if venue not found
          setVenueData({ 
            venueName: "Unknown Venue", 
            image: "/images/Dining-room.jpg" 
          });
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        setVenueData({ 
          venueName: "Unknown Venue", 
          image: "/images/Dining-room.jpg" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [venueId]);

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

  if (loading) {
    return <div className="venue-booking-card">Loading...</div>;
  }

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