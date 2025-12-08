import React from "react";
import "../styles/VenueOverview.css";

export default function VenueOverviewCard({ venue }) {
  return (
    <div className="venue-card">
      <img
        src={venue.image || "/images/default-venue.jpg"}
        alt={venue.venueName}
        className="venue-card-img"
      />

      <div className="venue-card-body">
        <h2 className="venue-card-title">{venue.venueName}</h2>

        <p className="venue-card-location">
          📍 {venue.venueLocation || "No location provided"}
        </p>

        <p className="venue-card-description">
          {venue.description || "No description available"}
        </p>

        <div className="venue-amenities">
          <strong>Amenities:</strong>
          <div className="amenities-list">
            {venue.amenities?.length > 0 ? (
              venue.amenities.map((item, index) => (
                <span key={index} className="amenity-chip">
                  {item}
                </span>
              ))
            ) : (
              <small className="no-amenities">No amenities</small>
            )}
          </div>
        </div>

        <p className="venue-custodian">
          <strong>Custodian:</strong>{" "}
          {venue.custodianName ? venue.custodianName : "Not assigned"}
        </p>
      </div>
    </div>
  );
}
