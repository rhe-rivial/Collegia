import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BookingHistory.css";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = () => {
      try {
        const savedBookings = JSON.parse(localStorage.getItem("userBookings")) || [];
        console.log('🔵 BookingHistory - Loaded bookings:', savedBookings);
        setBookings(savedBookings);
      } catch (error) {
        console.error("Error loading bookings:", error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Load initially
    loadBookings();

    // Listen for booking updates from other components
    const handleBookingUpdate = () => {
      console.log('🟡 BookingHistory - Booking update detected, reloading...');
      loadBookings();
    };

    window.addEventListener('bookingUpdated', handleBookingUpdate);
    window.addEventListener('storage', handleBookingUpdate);

    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
      window.removeEventListener('storage', handleBookingUpdate);
    };
  }, []);

  const handleViewClick = () => {
    navigate("/bookings");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "#28A745";
      case "pending": return "#FFC107";
      case "rejected": return "#DC3545";
      case "canceled": return "#6C757D";
      default: return "#6C757D";
    }
  };

  if (isLoading) {
    return (
      <div className="history-card">
        <h3 className="history-title">Booking History</h3>
        <div className="empty-history">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="history-card">
      <h3 className="history-title">Booking History</h3>

      {bookings.length === 0 ? (
        <div className="empty-history">No bookings yet.</div>
      ) : (
        <div className="history-list">
          {bookings.slice(0, 3).map((booking, index) => ( // Show only latest 3
            <div className="history-item" key={booking.id || index}>
              <img 
                src={booking.image || "/images/Dining-room.jpg"} 
                alt="venue" 
                className="history-thumb" 
              />
              <div className="history-info">
                <div className="history-venue">{booking.venueName || "Venue"}</div>
                <div className="history-date">{booking.eventDate || ""}</div>
                <div className="history-time">{booking.duration || ""}</div>
                <div className="history-guests">{booking.guests || ""}</div>
                <div 
                  className="history-status" 
                  style={{ color: getStatusColor(booking.status) }}
                >
                  {booking.status || "Pending"}
                </div>
              </div>
              <button className="view-btn" onClick={handleViewClick}>
                View
              </button>
            </div>
          ))}
          {bookings.length > 3 && (
            <div className="view-all-container">
              <button className="view-all-btn" onClick={handleViewClick}>
                View All Bookings ({bookings.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}