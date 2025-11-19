import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import VenuesCard from "./VenuesCard.jsx";
import "../styles/VenuesCard.css";

export default function VenuesGrid() {
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

  const filteredVenues = venues.filter(
    (venue) => venue.venueLocation.toLowerCase() === currentTag.toLowerCase()
  );

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
      {filteredVenues.length > 0 ? (
        filteredVenues.map((venue) => (
          <VenuesCard
            key={venue.venueId}
            id={venue.venueId}
            title={venue.venueName}
            image={venue.image || "/images/Dining-room.jpg"} // Fallback image
            isFavorite={favorites[venue.venueId] || false}
            onFavoriteToggle={() => toggleFavorite(venue.venueId)}
          />
        ))
      ) : (
        <p>No venues found for "{currentTag.toUpperCase()}"</p>
      )}
    </div>
  );
}