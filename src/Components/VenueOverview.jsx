import React, { useEffect, useState } from "react";
import VenueOverviewCard from "./VenueOverviewCard";
import "../styles/VenueOverview.css";

export default function VenueOverview() {
  const [venues, setVenues] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/venues")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching venues:", err));
  }, []);

  // 🔎 Search filter
  useEffect(() => {
    const result = venues.filter((venue) =>
      venue.venueName.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, venues]);

  return (
    <div className="venue-overview-container">
      <h1 className="venue-overview-title">Venue Overview</h1>

      {/* 🔎 Search Bar */}
      <div className="venue-search-container">
        <input
          type="text"
          className="venue-search-input"
          placeholder="Search venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="venue-grid">
        {filtered.length > 0 ? (
          filtered.map((venue) => (
            <VenueOverviewCard key={venue.venueId} venue={venue} />
          ))
        ) : (
          <p className="no-results">No venues found.</p>
        )}
      </div>
    </div>
  );
}
