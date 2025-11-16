import React from "react";
import "../styles/Homepage.css";

export default function Homepage() {
  return (
    <div className="homepage">

      {/* HERO SECTION */}
      <section className="hero">
        <img src="/images/school.jpg" alt="CIT-U Campus" className="hero-image" />

        <div className="hero-overlay">

          {/* FIND + Tabs */}
          <div className="find-header">
  
        <h1 className="find-title">FIND</h1>

        <div className="find-tabs">
          <button className="find-tab active">Room</button>
          <button className="find-tab">Gymnasium</button>
          <button className="find-tab">Court</button>
        </div>

      </div>

          {/* SEARCH BAR */}
          <div className="find-search-bar">

            <div className="find-field">
              <label>Location</label>
              <span className="find-placeholder">Which city do you prefer?</span>
            </div>

            <div className="find-divider"></div>

            <div className="find-field">
              <label>Event Start</label>
              <span className="find-placeholder">Add Dates</span>
            </div>

            <div className="find-divider"></div>

            <div className="find-field">
              <label>Event End</label>
              <span className="find-placeholder">Add Dates</span>
            </div>

            <div className="find-divider"></div>

            <div className="find-field">
              <label>Guests</label>
              <span className="find-placeholder">Add Guests</span>
            </div>

            <button className="find-search-button">
              <img src="/icons/search.png" alt="Search" className="find-search-icon"/>
            </button>

          </div>
        </div>
      </section>

      {/* RECENT EVENTS */}
      <section className="events-section">
        <h2 className="section-title">Recent Events</h2>

        <div className="events-grid">
          <img src="/images/event1.png" className="event-card" alt="Event 1" />
          <img src="/images/event2.png" className="event-card" alt="Event 2" />
          <img src="/images/event3.png" className="event-card" alt="Event 3" />
          <img src="/images/event4.png" className="event-card" alt="Event 4" />
        </div>
      </section>

      {/* BOOK A VENUE NOW */}
      <section className="venue-banner">
        <div className="venue-text">
          <h2>Book a Venue Now!</h2>
          <p>Explore more venues</p>
          <button className="yellow-btn">Find a Venue</button>
        </div>

        <div className="venue-carousel">
          <button className="carousel-arrow">‹</button>

          <div className="carousel-images">
            <img src="/images/gym.png" alt="Venue" />
            <img src="/images/canteen.png" alt="Venue" />
            <img src="/images/gym.png" alt="Venue" />
          </div>

          <button className="carousel-arrow">›</button>
        </div>
      </section>

      {/* VENUE BOOKING GUIDE */}
      <section className="guide-section">
        <h2 className="section-title">Venue Booking Guide</h2>

        <div className="guide-row">
          <div className="guide-card"></div>
          <div className="guide-card"></div>
          <div className="guide-card"></div>
        </div>

        <div className="guide-row-text">
          <p>Choose the right venue</p>
          <p>Step-by-Step Venue Reservation Guide</p>
          <p>Book School Spaces With Ease</p>
        </div>

        <button className="view-guide-btn">View All Guide</button>
      </section>

      {/* DISCOVER MORE */}
      <section className="discover-section">
        <div className="discover-text">
          <h2>Discover More About The University</h2>
          <p>
           
              The Cebu Institute of Technology – University is an autonomous, private, non-sectarian academic institution in Cebu City, Philippines. The university provides basic and higher education with a foundation in general and technological education. 
          </p>

          <div className="discover-actions">
            <button className="link-btn">Ask A Question</button>
            <button className="link-btn">Find A Venue</button>
          </div>

          <button className="discover-btn"><a style={{textDecoration: 'none', color: "white"}}href="https://cit.edu">Discover More</a></button>
        </div>

        <img src="/images/about-image.png" alt="CIT-U" className="discover-image" />
      </section>

    </div>
  );
}
