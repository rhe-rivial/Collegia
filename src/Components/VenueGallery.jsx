import React from "react";
import "../styles/VenueGallery.css";

export default function VenueGallery({ images }) {
  // Ensure we have at least 4 images for the layout
  const galleryImages = images.length >= 4 ? images : [
    "images/Dining-room.jpg",
    "images/Dining-room.jpg", 
    "images/Dining-room.jpg",
    "images/Dining-room.jpg"
  ];

  return (
    <div className="venue-gallery-fullwidth">
      <div className="venue-gallery">
        <div className="gallery-main">
          <div className="main-image-placeholder"></div>
          <img 
            className="main-image" 
            src={galleryImages[0]} 
            alt="Main venue view" 
          />
        </div>
        
        <div className="gallery-thumbnails">
          {galleryImages.slice(1, 4).map((image, index) => (
            <div key={index} className="thumbnail-container">
              <div className="thumbnail-placeholder"></div>
              <img 
                className={`thumbnail ${index === 2 ? 'more-photos' : ''}`} 
                src={image} 
                alt={`Venue view ${index + 2}`} 
              />
              {index === 2 && (
                <div className="more-photos-overlay">
                  <div className="more-count">+2</div>
                  <div className="more-text">More</div>
                  <div className="more-photos-text">Photos</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}