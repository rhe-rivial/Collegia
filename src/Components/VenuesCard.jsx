import React from "react";
import "../styles/VenuesCard.css"; 

export default function VenuesCard({ title, image, isFavorite, onFavoriteToggle }) {
  return (
    <div className="venue-card">
      <div className="venue-image-container">
        <img className="venue-image" src={image} alt={title} />

        <button
          className="favorite-button"
          aria-label="Favorite"
          onClick={onFavoriteToggle}
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
