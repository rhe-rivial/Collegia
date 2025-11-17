import React, { useState, useEffect } from "react";
import "../styles/BookingHistory.css";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load bookings from localStorage
    const loadBookings = () => {
      try {
        const savedBookings = JSON.parse(localStorage.getItem("userBookings")) || [];
        setBookings(savedBookings);
      } catch (error) {
        console.error("Error loading bookings:", error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

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
          {bookings.map((booking, index) => (
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
                <div className={`history-status ${booking.status || "pending"}`}>
                  {booking.status || "Pending"}
                </div>
              </div>
              <button className="view-btn">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}