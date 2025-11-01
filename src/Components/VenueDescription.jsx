import React from "react";
import "../styles/VenueDetails.css";

export default function VenueDescription({ title, building, capacity, description, amenities }) {
  return (
    <div className="venue-description">
      <div className="venue-header">
        <div className="venue-title-section">
          <h1 className="venue-title">{title}</h1>
          <p className="venue-building">{building}</p>
        
        <div className="venue-capacity">
          <div className="capacity-icon">
            <img src="/icons/team.png" alt="Capacity" />
          </div>
          <span>{capacity}</span>
        </div>
        </div>

        <div className="favorite-share">
        <img src="/icons/heart-red.svg"></img>
        <img src="/icons/share.svg"></img>
        </div>
        
      </div>

      <div className="description-section">
        <h2 className="section-title">Venue Description</h2>
        {description.map((paragraph, index) => (
          <p key={index} className="description-text">{paragraph}</p>
        ))}
      </div>

      <div className="amenities-section">
        <h2 className="section-title">Offered Amenities</h2>
        <div className="amenities-grid">
         {amenities.map((amenity, index) => {
            const name = typeof amenity === "string" ? amenity : amenity.name;
            const icon = typeof amenity === "string" ? "/icons/default.svg" : amenity.icon;
            
            return (
                <div key={index} className="amenity-item">
                <img className="amenity-icon" src={icon} alt={name} />
                <span className="amenity-text">{name}</span>
                </div>
            );
            })}
        </div>
      </div>
    </div>
  );
}