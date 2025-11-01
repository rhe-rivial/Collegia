import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import VenuesCard from "./VenuesCard.jsx";
import "../styles/VenuesCard.css";

// Sample venue data with tags
const venuesData = [
  // NGE
  { id: 1, title: "NGE 101", image: "/images/Dining-room.jpg", tag: "NGE" },
  { id: 2, title: "NGE Hall A", image: "/images/Dining-room.jpg", tag: "NGE" },
  { id: 3, title: "NGE Hall B", image: "/images/Dining-room.jpg", tag: "NGE" },

  // SAL
  { id: 7, title: "Aurora Hall", image: "/images/Dining-room.jpg", tag: "SAL" },
  { id: 8, title: "SAL Main Hall", image: "/images/Dining-room.jpg", tag: "SAL" },
  { id: 9, title: "SAL Conference", image: "/images/Dining-room.jpg", tag: "SAL" },
  { id: 10, title: "SAL Lounge", image: "/images/Dining-room.jpg", tag: "SAL" },

  // GLE
  { id: 13, title: "Skyline Lounge", image: "/images/Dining-room.jpg", tag: "GLE" },
  { id: 14, title: "GLE Hall A", image: "/images/Dining-room.jpg", tag: "GLE" },
  { id: 15, title: "GLE Hall B", image: "/images/Dining-room.jpg", tag: "GLE" },
  { id: 16, title: "GLE Garden", image: "/images/Dining-room.jpg", tag: "GLE" },

  // Court
  { id: 19, title: "Court Pavilion", image: "/images/Dining-room.jpg", tag: "Court" },
  { id: 20, title: "Court Hall A", image: "/images/Dining-room.jpg", tag: "Court" },
  { id: 21, title: "Court Hall B", image: "/images/Dining-room.jpg", tag: "Court" },

  // ACAD
  { id: 25, title: "ACAD Hall", image: "/images/Dining-room.jpg", tag: "ACAD" },
  { id: 26, title: "ACAD Conference", image: "/images/Dining-room.jpg", tag: "ACAD" },
  { id: 27, title: "ACAD Lounge", image: "/images/Dining-room.jpg", tag: "ACAD" },

  // More
  { id: 31, title: "More Venue 1", image: "/images/Dining-room.jpg", tag: "More" },
  { id: 32, title: "More Venue 2", image: "/images/Dining-room.jpg", tag: "More" },
  { id: 33, title: "More Venue 3", image: "/images/Dining-room.jpg", tag: "More" },
  { id: 34, title: "More Venue 4", image: "/images/Dining-room.jpg", tag: "More" },
];

export default function VenuesGrid() {
  const location = useLocation();
  const currentTag = location.pathname.replace("/", "") || "NGE";

  // Store favorites in state by venue ID
  const [favorites, setFavorites] = useState({});

  // Optionally, load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVenues = venuesData.filter(
    (venue) => venue.tag.toLowerCase() === currentTag.toLowerCase()
  );

 const venuesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "60px",
  padding: "20px",
  width: "100%",
  maxWidth: "1200px", 
  margin: "0 auto",
};


  return (
    <div style={venuesGridStyle}>
      {filteredVenues.length > 0 ? (
        filteredVenues.map((venue) => (
          <VenuesCard
            key={venue.id}
            title={venue.title}
            image={venue.image}
            isFavorite={favorites[venue.id] || false}
            onFavoriteToggle={() => toggleFavorite(venue.id)}
          />
        ))
      ) : (
        <p>No venues found for "{currentTag.toUpperCase()}"</p>
      )}
    </div>
  );
}
