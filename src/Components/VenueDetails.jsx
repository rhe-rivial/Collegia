import React from "react";
import { useParams } from "react-router-dom";
import VenueGallery from "./VenueGallery.jsx";
import VenueDescription from "./VenueDescription.jsx";
import VenueBookingCard from "./VenueBookingCard.jsx";
import "../styles/VenueDetails.css";

// Import the same venuesData from VenuesGrid (or define it here)
const venuesData = [
  // NGE
  { 
    id: 1, 
    title: "NGE 101", 
    image: "/images/Dining-room.jpg", 
    tag: "NGE",
    building: "Nicolas G. Escario Building",
    capacity: "42 persons",
    description: [
      "NGE 101 is a versatile classroom space perfect for lectures, workshops, and training sessions. Equipped with modern audio-visual equipment and comfortable seating.",
      "Features include high-speed Wi-Fi, projection capabilities, and flexible seating arrangements to accommodate various event formats."
    ],
    amenities: ["Air Conditioner", "Television", "Projector", "Free Wireless Internet"]
  },
  { 
    id: 2, 
    title: "NGE Hall A", 
    image: "/images/Dining-room.jpg", 
    tag: "NGE",
    building: "Nicolas G. Escario Building",
    capacity: "80 persons",
    description: [
      "NGE Hall A is a spacious hall suitable for larger gatherings, conferences, and special events.",
      "This venue offers excellent acoustics and professional lighting for presentations and performances."
    ],
    amenities: ["Air Conditioner", "Sound System", "Stage Lighting", "Free Wireless Internet"]
  },
  { 
    id: 3, 
    title: "NGE Hall B", 
    image: "/images/Dining-room.jpg", 
    tag: "NGE",
    building: "Nicolas G. Escario Building",
    capacity: "60 persons",
    description: [
      "NGE Hall B provides an intimate setting for meetings and small to medium-sized events.",
      "Ideal for corporate functions, seminars, and social gatherings with professional amenities."
    ],
    amenities: ["Air Conditioner", "Whiteboard", "Audio System", "Free Wireless Internet"]
  },

  // SAL
  { 
    id: 7, 
    title: "Aurora Hall", 
    image: "/images/Dining-room.jpg", 
    tag: "SAL",
    building: "St. Augustine's Learning Center",
    capacity: "100 persons",
    description: [
      "Aurora Hall features elegant architecture and natural lighting, perfect for formal events and celebrations.",
      "This prestigious venue offers a sophisticated atmosphere for weddings, galas, and important ceremonies."
    ],
    amenities: ["Air Conditioner", "Catering Kitchen", "Grand Piano", "Free Wireless Internet"]
  },
  { 
    id: 8, 
    title: "SAL Main Hall", 
    image: "/images/Dining-room.jpg", 
    tag: "SAL",
    building: "St. Augustine's Learning Center",
    capacity: "150 persons",
    description: [
      "SAL Main Hall is our largest venue, designed for major events, conferences, and large gatherings.",
      "State-of-the-art facilities and ample space make this ideal for exhibitions and large-scale presentations."
    ],
    amenities: ["Air Conditioner", "Multiple Projectors", "Stage", "Free Wireless Internet"]
  },

  // Add more venue data as needed...
];

// Default data for venues not found in the array
const getDefaultVenueData = (id, title) => ({
  id: id,
  title: title || "Unknown Venue",
  building: "University Campus Building",
  capacity: "50 persons",
  description: [
    "This venue offers comfortable and functional space for various events and activities.",
    "Equipped with basic amenities and suitable for academic, organizational, and social functions."
  ],
  amenities: ["Air Conditioner", "Basic Furniture", "Lighting", "Free Wireless Internet"],
  images: [
    "/images/Dining-room.jpg",
    "/images/Dining-room.jpg",
    "/images/Dining-room.jpg",
    "/images/Dining-room.jpg"
  ]
});

export default function VenueDetails() {
  const { id } = useParams();

  // Find the venue data by ID
  const venueId = parseInt(id);
  const venueFromData = venuesData.find(venue => venue.id === venueId);
  
  // Use the found data or create default data
  const venueData = venueFromData 
    ? {
        id: venueFromData.id,
        title: venueFromData.title,
        building: venueFromData.building || "University Campus Building",
        capacity: venueFromData.capacity || "50 persons",
        description: venueFromData.description || [
          "This venue offers comfortable and functional space for various events and activities.",
          "Equipped with basic amenities and suitable for academic, organizational, and social functions."
        ],
        amenities: [
        { name: "Air Conditioner", icon: "/icons/air-conditioner.png" },
        { name: "Television", icon: "/icons/tv.png" },
        { name: "Projector", icon: "/icons/tv.png" },
        { name: "Free Wireless Internet", icon: "/icons/wifi.png" }
        ],
        images: [
          venueFromData.image || "/images/Dining-room.jpg",
          "/images/Dining-room.jpg",
          "/images/Dining-room.jpg",
          "/images/Dining-room.jpg"
        ]
      }
    : getDefaultVenueData(venueId, `Venue ${id}`);

    return (
     <div className="venue-details-container">
      <div className="venue-details-content">
        <VenueGallery images={venueData.images} />
    
        <div className="venue-details-bottom">
          <div className="venue-left-column">
            <VenueDescription
              title={venueData.title}
              building={venueData.building}
              capacity={venueData.capacity}
              description={venueData.description}
              amenities={venueData.amenities}
            />
          </div>

          <div className="venue-right-column">
            <VenueBookingCard />
          </div>
        </div>
      </div>
    </div>
    );
}