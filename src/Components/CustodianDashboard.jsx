import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import apiCall  from "../api.js";
import "../styles/CustodianDashboard.css";

export default function CustodianDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [myVenuesCount, setMyVenuesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isCustodian = user && (user.userType === "Custodian" || user.userType === "custodian" || user.userType === "CUSTODIAN");

  useEffect(() => {
    if (isCustodian && user?.userId) {
      fetchDashboardData();
    }
  }, [isCustodian, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch my venues count
      const venuesResponse = await apiCall(`/venues/custodian/${user.userId}`);
      setMyVenuesCount(Array.isArray(venuesResponse) ? venuesResponse.length : 0);

      // Fetch today's bookings - Note: You'll need to create this endpoint or adjust the logic
      const today = new Date().toISOString().split('T')[0];
      
      // First, get all bookings for custodian's venues
      const allBookings = await apiCall(`/bookings`);
      
      // Filter for today's bookings for this custodian's venues
      const todaysBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
        return bookingDate === today && 
               booking.venue?.custodian?.userId === user.userId;
      });
      setTodaysSchedule(todaysBookings);

      // Filter for upcoming bookings (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const upcoming = allBookings.filter(booking => {
        const bookingDate = new Date(booking.startTime);
        return bookingDate > new Date() && 
               bookingDate <= nextWeek &&
               booking.venue?.custodian?.userId === user.userId;
      });
      setUpcomingBookings(upcoming);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
      
      // Fallback to mock data if API fails
      setTodaysSchedule([]);
      setUpcomingBookings([]);
      setMyVenuesCount(0);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "Time not set";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return "Invalid time";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const getBookingDate = (booking) => {
    return booking.startTime ? formatDate(booking.startTime) : "Date not set";
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return "pending";
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'completed') return 'approved';
    if (statusLower === 'pending') return 'pending';
    if (statusLower === 'rejected' || statusLower === 'cancelled') return 'rejected';
    return 'pending';
  };

  if (!isCustodian) {
    return (
      <div className="custodian-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This section is only available for custodians.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="custodian-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custodian-dashboard">
      <div className="dashboard-header">
        <h1>Custodian Dashboard</h1>
        <div className="welcome-message">
          Welcome, <span className="user-name">{user.firstName} {user.lastName}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      )}
      
      {/* Today's Schedule Section */}
      <div className="todays-schedule">
        <h2>Today's Schedule: {formatDate(new Date())}</h2>
        
        {todaysSchedule.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings scheduled for today.</p>
          </div>
        ) : (
          todaysSchedule.map((booking, index) => (
            <div key={booking.bookingId || index} className="schedule-item">
              <div className="venue-header">
                <h3>{booking.venue?.venueName || "Venue"}</h3>
                <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status || "Pending"}
                </span>
              </div>
              <div className="event-details">
                <div className="event-time">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </div>
                <div className="event-name">
                  {booking.eventName || "Event"}
                </div>
                <div className="event-organizer">
                  Organizer: {booking.user?.firstName} {booking.user?.lastName}
                </div>
                {booking.specialRequests && (
                  <div className="event-notice">
                    <span className="notice-icon">📋</span>
                    Special Requests: {booking.specialRequests}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upcoming Bookings Section */}
      <div className="upcoming-bookings">
        <div className="section-header">
          <h3>Upcoming Bookings</h3>
          {upcomingBookings.length > 0 && (
            <button 
              className="view-all-btn"
              onClick={() => navigate("/bookings")}
            >
              View All
            </button>
          )}
        </div>
        
        {upcomingBookings.length === 0 ? (
          <div className="no-bookings">
            <p>No upcoming bookings for your venues.</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {upcomingBookings.slice(0, 4).map((booking, index) => (
              <div key={booking.bookingId || index} className="booking-card">
                <div className="booking-date">
                  {getBookingDate(booking)}
                </div>
                <div className="booking-details">
                  <div className="booking-event">{booking.eventName || "Event"}</div>
                  <div className="booking-venue">{booking.venue?.venueName || "Venue"}</div>
                  <div className="booking-time">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </div>
                </div>
                <div className="booking-status">
                  <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="statistics">
        <div className="stat-card">
          <div className="stat-value">{myVenuesCount}</div>
          <div className="stat-label">Total Venues</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{todaysSchedule.length}</div>
          <div className="stat-label">Today's Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{upcomingBookings.length}</div>
          <div className="stat-label">Upcoming Bookings</div>
        </div>
      </div>
    </div>
  );
}