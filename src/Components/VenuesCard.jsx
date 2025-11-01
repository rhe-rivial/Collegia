import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/VenuesCard.css";

export default function VenuesCard({ id, title, image, isFavorite, onFavoriteToggle }) {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/venue/${id}`); // Go to details page
  };

  return (
    <div className="venue-card">
      <div className="venue-image-container" onClick={handleImageClick}>
        <img className="venue-image" src={image} alt={title} />

        <button
          className="favorite-button"
          aria-label="Favorite"
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation when clicking favorite
            onFavoriteToggle();
          }}
        >
          <img
            alt="favorite-button"
            src={isFavorite ? "icons/favorite-filled.png" : "icons/favorite.png"}
            className="heart-icon"
          />
        </button>
      </div>

      <h3 className="venue-title">{title}</h3>
    </div>
  );
}
