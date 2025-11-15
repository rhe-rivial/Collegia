import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Bookings.css"; 

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activeIndicatorLeft, setActiveIndicatorLeft] = useState("0px");
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

  // bookings will be added when users book venues
  const [bookingsData, setBookingsData] = useState([]);

  // Sample data NOT IN FINAL
  const sampleBookingsData = [
    {
      id: 1,
      venueName: "Gymnasium",
      eventDate: "12 Mar 2021",
      duration: "1:00-3:00 PM",
      guests: "40 pax",
      bookedBy: "John Doe",
      status: "approved",
      image: "https://placehold.co/103x94"
    },
    {
      id: 2,
      venueName: "Conference Hall",
      eventDate: "15 Mar 2021",
      duration: "2:00-4:00 PM",
      guests: "25 pax",
      bookedBy: "Jane Smith",
      status: "pending",
      image: "https://placehold.co/103x94"
    },
    {
      id: 3,
      venueName: "Auditorium",
      eventDate: "18 Mar 2021",
      duration: "9:00-11:00 AM",
      guests: "100 pax",
      bookedBy: "Mike Johnson",
      status: "rejected",
      image: "https://placehold.co/103x94"
    },
    {
      id: 4,
      venueName: "Meeting Room A",
      eventDate: "20 Mar 2021",
      duration: "3:00-5:00 PM",
      guests: "15 pax",
      bookedBy: "Sarah Wilson",
      status: "canceled",
      image: "https://placehold.co/103x94"
    }
  ];

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("userBookings");
    if (savedBookings) {
      setBookingsData(JSON.parse(savedBookings));
    } else {
      // For demo purposes, use sample data if no bookings exist
      // Remove this else block if you want completely empty initially
      setBookingsData(sampleBookingsData);
      localStorage.setItem("userBookings", JSON.stringify(sampleBookingsData));
    }
  }, []);

  const handleBookVenue = () => {
    navigate("/venues"); // Navigate back to venues to book a venue
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
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredBookings = bookingsData.filter(booking => 
    activeTab === "upcoming" ? true : booking.status === activeTab
  );

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
            filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <img 
                  className="booking-image" 
                  src={booking.image} 
                  alt={booking.venueName} 
                />
                
                <div className="booking-details">
                  <h3 className="venue-name">{booking.venueName}</h3>
                  
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
              <p>You haven't made any venue bookings yet.</p>
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