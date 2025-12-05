import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { bookingAPI } from "../api.js";

import "../styles/BookingHistory.css";


export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  
  useEffect(() => {
    const fetchBookingsFromDB = async () => {
      if (!user || !user.userId) {
        setIsLoading(false);
        return;
      }

      try {
        const userBookings = await bookingAPI.getUserBookings(user.userId);
        
        const transformedBookings = userBookings.map(booking => ({
          id: booking.bookingId,
          venueName: booking.venue?.venueName || "Unknown Venue",
          eventDate: formatEventDate(booking.date),
          duration: formatTimeSlot(booking.timeSlot),
          guests: `${booking.capacity} pax`,
          bookedBy: user.firstName || "You",
          status: booking.status ? "approved" : "pending",
          image: booking.venue?.image || "/images/Dining-room.jpg",
          eventName: booking.eventName,
          eventType: booking.eventType
        }));
        
        setBookings(transformedBookings);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError("Failed to load bookings");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingsFromDB();
  }, [user]);

  const formatEventDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        day: "2-digit", 
        month: "short", 
        year: "numeric" 
      });
    } catch {
      return "Invalid date";
    }
  };

const calculateEndTime = (timeSlot, durationHours = 1) => {
  try {
    const timeStr = typeof timeSlot === "string" ? timeSlot : timeSlot.toString();
    const [hours, minutes] = timeStr.split(":").slice(0, 2).map(Number);
    const start = new Date();
    start.setHours(hours, minutes || 0, 0, 0);
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    return end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
};



  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return "";
    
    try {
      const timeStr = typeof timeSlot === 'string' ? timeSlot : timeSlot.toString();
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeSlot;
    }
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

  const handleViewClick = () => {
    navigate("/bookings");
  };

  if (isLoading) {
    return (
      <div className="history-card">
        <h3 className="history-title">Booking History</h3>
        <div className="empty-history">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-card">
        <h3 className="history-title">Booking History</h3>
        <div className="empty-history">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="history-card">
        <h3 className="history-title">Booking History</h3>
        <div className="empty-history">Please log in to view your bookings</div>
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
          {bookings.map((booking) => (
            <div className="history-item" key={booking.id}>
              <img 
                src={booking.image} 
                alt="venue" 
                className="history-thumb" 
              />
              <div className="history-info">
                <div className="history-venue">{booking.venueName}</div>
                <div className="history-event">{booking.eventName} - {booking.eventType}</div>
                <div className="history-date">{booking.eventDate}</div>
                <div className="history-time">{booking.duration}</div>
                <div className="history-guests">{booking.guests}</div>
                <div 
                  className="history-status" 
                  style={{ color: getStatusColor(booking.status) }}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
              <button className="view-btn" onClick={handleViewClick}>
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}