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
  
  const [showSharePopup, setShowSharePopup] = useState(false);

  // Handle favorite toggle - just pass through to parent
  const handleFavoriteClick = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(venueId, !isFavorite);
    }
  };

  // Handle share click
  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      const shareUrl = `${window.location.origin}/venues/venue/${venueId}`;
      setShowSharePopup(true);
      
      // Auto-hide popup after 3 seconds
      setTimeout(() => setShowSharePopup(false), 3000);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}/venues/venue/${venueId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert("Link copied to clipboard!");
        setShowSharePopup(false);
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy link. Please try again.");
      });
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
          <button 
            className="favorite-button-details"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
              <img
                src={isFavorite ? "/icons/heart-red.svg" : "/icons/heart-red-filled.png"}
                className="heart-icon"
                alt="favorite-button"
              />
          </button>
          
          <button 
            className="share-button-details"
            onClick={handleShareClick}
            aria-label="Share venue"
          >
            <img src="/icons/share.svg" alt="Share" />
          </button>
        </div>
      </div>

      {/* Share Popup */}
      {showSharePopup && (
        <div className="share-popup-overlay" onClick={() => setShowSharePopup(false)}>
          <div className="share-popup" onClick={(e) => e.stopPropagation()}>
            <div className="share-popup-header">
              <h3>Share this venue</h3>
              <button 
                className="close-popup-btn"
                onClick={() => setShowSharePopup(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="share-options">
              <p className="share-link-label">Link to share:</p>
              <div className="share-link-container">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/venues/venue/${venueId}`}
                  className="share-link-input"
                />
                <button 
                  onClick={copyToClipboard}
                  className="copy-link-btn"
                >
                  Copy
                </button>
              </div>
              
              <div className="share-buttons">
                <button 
                  className="share-option-btn"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/venues/venue/${venueId}`;
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${title} on our venue booking platform!`)}`, '_blank');
                  }}
                >
                  <img src="/icons/twitter.svg" alt="Twitter" />
                  Twitter
                </button>
                
                <button 
                  className="share-option-btn"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/venues/venue/${venueId}`;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                  }}
                >
                  <img src="/icons/facebook.svg" alt="Facebook" />
                  Facebook
                </button>
                
                <button 
                  className="share-option-btn"
                  onClick={() => {
                    const shareText = `Check out ${title} - ${building} on our venue booking platform!`;
                    const shareUrl = `${window.location.origin}/venues/venue/${venueId}`;
                    
                    if (navigator.share) {
                      navigator.share({
                        title: title,
                        text: shareText,
                        url: shareUrl,
                      });
                    } else {
                      copyToClipboard();
                    }
                  }}
                >
                  <img src="/icons/link.svg" alt="Share" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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