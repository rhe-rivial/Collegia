import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import VenuesCard from "./VenuesCard.jsx";
import "../styles/VenuesCard.css";

export default function VenuesGrid({ searchQuery, showFilters, filters }) {
  const location = useLocation();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});

  const path = location.pathname.split("/").pop();
  const currentTag = path.toUpperCase() === "VENUES" || path === "" ? "NGE" : path.toUpperCase();

  // Load venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/venues');
        if (response.ok) {
          const venuesData = await response.json();
          setVenues(venuesData);
        } else {
          console.error('Failed to fetch venues');
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVenues = venues.filter((venue) => {
    // Only apply category filter when NOT searching and NOT showing filters
    const categoryMatch = !searchQuery && !showFilters && currentTag !== "VENUES" 
      ? venue.venueLocation.toLowerCase() === currentTag.toLowerCase()
      : true; 

    // Search filter
    const searchMatch = !searchQuery || 
      venue.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.venueLocation.toLowerCase().includes(searchQuery.toLowerCase());

    // Capacity filter
    const capacityMatch = !filters.capacity || 
      venue.venueCapacity >= parseInt(filters.capacity);

    // Location filter
    const locationFilterMatch = !filters.location || 
      venue.venueLocation === filters.location;

    return categoryMatch && searchMatch && capacityMatch && locationFilterMatch;
  });


  const venuesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "60px",
    paddingTop: "40px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    marginBottom: "100px",
  };

  if (loading) {
    return <div>Loading venues...</div>;
  }

  return (
    <div style={venuesGridStyle}>
    {(searchQuery || filters.capacity || filters.location) && (
      <div className="results-info">
        <p>
          Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
          {filters.location && ` in ${filters.location}`}
          {filters.capacity && ` with ${filters.capacity}+ capacity`}
        </p>
      </div>
    )}


      {filteredVenues.length > 0 ? (
        filteredVenues.map((venue) => (
          <VenuesCard
            key={venue.venueId}
            id={venue.venueId}
            title={venue.venueName}
            image={venue.image || "/images/Dining-room.jpg"}
            isFavorite={favorites[venue.venueId] || false}
            onFavoriteToggle={() => toggleFavorite(venue.venueId)}
          />
        ))
      ) : (
        <div className="no-results">
        <p>
          {(!searchQuery && !showFilters)
            ? `No venues found for "${currentTag}"`
            : "No venues match your search or filters"}
        </p>
        {(searchQuery || filters.capacity || filters.location) && (
          <p>Try adjusting your search or filters</p>
        )}
      </div>
      )}
    </div>
  );
}