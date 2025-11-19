import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Bookings.css"; 

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activeIndicatorLeft, setActiveIndicatorLeft] = useState("0px");
  const [bookingsData, setBookingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Tab configuration with positions for the active indicator
  const tabItems = [
    { id: "upcoming", label: "Upcoming", left: "0px", width: "107px" },
    { id: "approved", label: "Approved", left: "121px", width: "104px" },
    { id: "rejected", label: "Rejected", left: "230px", width: "89px" },
    { id: "canceled", label: "Canceled", left: "350px", width: "89px" }
  ];

  // Update active indicator position when tab changes
  useEffect(() => {
    const activeItem = tabItems.find(item => activeTab === item.id) || tabItems[0];
    setActiveIndicatorLeft(activeItem.left);
  }, [activeTab]);

  // Load bookings from localStorage and listen for updates
  useEffect(() => {
    const loadBookings = () => {
      try {
        const savedBookings = JSON.parse(localStorage.getItem("userBookings")) || [];
        console.log('🔵 Bookings - Loaded bookings:', savedBookings);
        setBookingsData(savedBookings);
      } catch (error) {
        console.error("Error loading bookings:", error);
        setBookingsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Load initially
    loadBookings();

    // Listen for booking updates
    const handleBookingUpdate = () => {
      console.log('🟡 Bookings - Booking update detected, reloading...');
      loadBookings();
    };

    window.addEventListener('bookingUpdated', handleBookingUpdate);
    window.addEventListener('storage', handleBookingUpdate);

    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
      window.removeEventListener('storage', handleBookingUpdate);
    };
  }, []);

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
            {/* Active indicator line */}
            <div 
              className="tab-indicator" 
              style={{ left: activeIndicatorLeft }}
            ></div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="bookings-list">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div key={booking.id || index} className="booking-item">
                <img 
                  className="booking-image" 
                  src={booking.image || "/images/Dining-room.jpg"} 
                  alt={booking.venueName} 
                />
                
                <div className="booking-details">
                  <h3 className="venue-name">{booking.venueName || "Venue"}</h3>
                  
                  <div className="booking-info">
                    <div className="info-group">
                      <span className="info-label">Event Date: </span>
                      <span className="info-value">{booking.eventDate || ""}</span>
                    </div>
                    
                    <div className="info-group">
                      <span className="info-label">Duration: </span>
                      <span className="info-value">{booking.duration || ""}</span>
                    </div>
                    
                    <div className="info-group">
                      <span className="info-label">Guests</span>
                      <span className="info-value">: {booking.guests || ""}</span>
                    </div>
                  </div>
                  
                  <div className="booked-by">
                    By: {booking.bookedBy || "You"}
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