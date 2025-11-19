import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { bookingAPI } from "../api";
import "../styles/Bookings.css";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activeIndicatorLeft, setActiveIndicatorLeft] = useState("0px");
  const [bookingsData, setBookingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const tabItems = [
    { id: "upcoming", label: "Upcoming", left: "0px", width: "107px" },
    { id: "approved", label: "Approved", left: "121px", width: "104px" },
    { id: "rejected", label: "Rejected", left: "230px", width: "89px" },
    { id: "canceled", label: "Canceled", left: "350px", width: "89px" }
  ];

  useEffect(() => {
    const activeItem = tabItems.find(item => activeTab === item.id) || tabItems[0];
    setActiveIndicatorLeft(activeItem.left);
  }, [activeTab]);

  useEffect(() => {
    const fetchBookingsFromDB = async () => {
      if (!user || !user.userId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔵 Bookings - Fetching bookings for user:', user.userId);
        const userBookings = await bookingAPI.getUserBookings(user.userId);
        console.log('🟢 Bookings - Bookings from DB:', userBookings);
        
        // Transform the data to match your frontend format
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
          eventType: booking.eventType,
          description: booking.description,
          rawDate: booking.date 
        }));
        
        setBookingsData(transformedBookings);
        setError(null);
      } catch (err) {
        console.error('🔴 Bookings - Error fetching bookings:', err);
        setError("Failed to load bookings");
        setBookingsData([]);
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

  const handleBookVenue = () => {
    navigate("/venues");
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

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
  };

  // Filter bookings based on active tab
  const filteredBookings = bookingsData.filter(booking => {
    if (activeTab === "upcoming") {
      // Show all non-canceled, non-rejected bookings for upcoming
      return booking.status !== "canceled" && booking.status !== "rejected";
    } else {
      return booking.status === activeTab;
    }
  });

  if (isLoading) {
    return (
      <div className="bookings-container">
        <div className="bookings-card">
          <div className="loading-bookings">Loading your bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-container">
        <div className="bookings-card">
          <div className="no-bookings">
            <h3>Error Loading Bookings</h3>
            <p>{error}</p>
            <button 
              className="book-venue-button" 
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bookings-container">
        <div className="bookings-card">
          <div className="no-bookings">
            <h3>Please Log In</h3>
            <p>You need to be logged in to view your bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-card">
        <div className="bookings-header">
          <h1 className="bookings-title">Bookings</h1>
          <button className="book-venue-button" onClick={handleBookVenue}>
            Book A Venue
          </button>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {tabItems.map((tab) => (
              <button 
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ width: tab.width }}
              >
                {tab.label}
              </button>
            ))}
            <div 
              className="tab-indicator" 
              style={{ left: activeIndicatorLeft }}
            ></div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="bookings-list">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <img 
                  className="booking-image" 
                  src={booking.image} 
                  alt={booking.venueName} 
                />
                
                <div className="booking-details">
                  <h3 className="venue-name">{booking.venueName}</h3>
                  <div className="event-type">{booking.eventName} - {booking.eventType}</div>
                  
                  <div className="booking-info">
                    <div className="info-group">
                      <span className="info-label">Event Date: </span>
                      <span className="info-value">{booking.eventDate}</span>
                    </div>
                    
                    <div className="info-group">
                      <span className="info-label">Duration: </span>
                      <span className="info-value">{booking.duration}</span>
                    </div>
                    
                    <div className="info-group">
                      <span className="info-label">Guests</span>
                      <span className="info-value">: {booking.guests}</span>
                    </div>
                  </div>
                  
                  {booking.description && (
                    <div className="event-description">
                      {booking.description}
                    </div>
                  )}
                  
                  <div className="booked-by">
                    By: {booking.bookedBy}
                  </div>
                </div>
                
                <div className="booking-status">
                  <div 
                    className="status-indicator" 
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  ></div>
                  <span 
                    className="status-text" 
                    style={{ color: getStatusColor(booking.status) }}
                  >
                    {getStatusText(booking.status)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-bookings">
              <h3>No bookings found</h3>
              <p>
                {activeTab === "upcoming" 
                  ? "You don't have any upcoming bookings." 
                  : `You don't have any ${activeTab} bookings.`
                }
              </p>
              <button 
                className="book-venue-button" 
                onClick={handleBookVenue}
                style={{ marginTop: '1rem' }}
              >
                Book Your First Venue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}