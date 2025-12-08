import React, { useState } from "react";
import "../styles/VenueDetails.css";

export default function VenueDescription({ 
  title, 
  building, 
  capacity, 
  description, 
  amenities, 
  venueId,
  isFavorite,
  onFavoriteToggle,
  onShare 
}) {
  
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Handle favorite toggle
  const handleFavoriteClick = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(venueId, !isFavorite);
    }
  };

  // Share function
  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else {
      const shareUrl = `${window.location.origin}/venues/venue/${venueId}`;
      
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setShowCopiedMessage(true);
          setTimeout(() => setShowCopiedMessage(false), 2000);
        })
        .catch(err => {
          console.error("Failed to copy: ", err);
          // Fallback
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
          } catch (e) {
            console.error("Fallback copy failed: ", e);
            alert("Failed to copy link.");
          }
          document.body.removeChild(textArea);
        });
    }
  };

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
          <div className="share-button-wrapper">
            <button 
              className="share-button-details"
              onClick={handleShareClick}
              aria-label="Share venue"
            >
              <img src="/icons/share.svg" alt="Share" />
            </button>
            {showCopiedMessage && (
              <div className="copied-message-tooltip"> 
              Link Copied!
              </div>
            )}
          </div>
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
            const icon = typeof amenity === "string" ? "/icons/default.png" : amenity.icon;
            
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