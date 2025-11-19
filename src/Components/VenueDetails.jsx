import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueGallery from "./VenueGallery.jsx";
import VenueDescription from "./VenueDescription.jsx";
import VenueBookingCard from "./VenueBookingCard.jsx";
import "../styles/VenueDetails.css";

// Default data for venues not found
const getDefaultVenueData = (id, title) => ({
  venueId: id,
  venueName: title || "Unknown Venue",
  building: "University Campus Building",
  venueCapacity: "50 persons",
  description: [
    "This venue offers comfortable and functional space for various events and activities.",
    "Equipped with basic amenities and suitable for academic, organizational, and social functions."
  ],
  amenities: [
    { name: "Air Conditioner", icon: "/icons/air-conditioner.png" },
    { name: "Basic Furniture", icon: "/icons/furniture.png" },
    { name: "Lighting", icon: "/icons/lighting.png" },
    { name: "Free Wireless Internet", icon: "/icons/wifi.png" }
  ],
  images: [
    "/images/Dining-room.jpg",
    "/images/Dining-room.jpg",
    "/images/Dining-room.jpg",
    "/images/Dining-room.jpg"
  ]
});

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch venue data from API
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/venues/${id}`);
        
        if (response.ok) {
          const venueFromApi = await response.json();
          
          // Transform API data to match your component structure
          const transformedData = {
            venueId: venueFromApi.venueId,
            venueName: venueFromApi.venueName,
            building: venueFromApi.venueLocation || "University Campus Building",
            venueCapacity: `${venueFromApi.venueCapacity || 50} persons`,
            description: [
              `${venueFromApi.venueName} is a versatile space perfect for various events and activities.`,
              "Equipped with modern amenities and suitable for academic, organizational, and social functions."
            ],
            amenities: [
              { name: "Air Conditioner", icon: "/icons/air-conditioner.png" },
              { name: "Television", icon: "/icons/tv.png" },
              { name: "Projector", icon: "/icons/tv.png" },
              { name: "Free Wireless Internet", icon: "/icons/wifi.png" }
            ],
            images: [
              venueFromApi.image || "/images/Dining-room.jpg",
              "/images/Dining-room.jpg",
              "/images/Dining-room.jpg",
              "/images/Dining-room.jpg"
            ]
          };
          
          setVenueData(transformedData);
        } else {
          setError("Venue not found");
          setVenueData(getDefaultVenueData(parseInt(id), `Venue ${id}`));
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError("Failed to load venue data");
        setVenueData(getDefaultVenueData(parseInt(id), `Venue ${id}`));
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [id]);

  if (loading) {
    return <div className="venue-details-container">Loading venue details...</div>;
  }

  if (error && !venueData) {
    return <div className="venue-details-container">Error: {error}</div>;
  }

  return (
    <div className="venue-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <img alt="back-button" src="/icons/back.png" />
      </button>
      
      <div className="venue-details-content">
        <VenueGallery images={venueData.images} />
    
        <div className="venue-details-bottom">
          <div className="venue-left-column">
            <VenueDescription
              title={venueData.venueName}
              building={venueData.building}
              capacity={venueData.venueCapacity}
              description={venueData.description}
              amenities={venueData.amenities}
            />
          </div>

          <div className="venue-right-column">
            <VenueBookingCard venueId={venueData.venueId} venueData={venueData} />
          </div>
        </div>
      </div>
    </div>
  );
}