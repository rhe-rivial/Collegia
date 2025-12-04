import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import "../styles/AddVenueForm.css";

export default function AddVenueForm({ onVenueAdded }) {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    venueName: "",
    venueLocation: "",
    venueCapacity: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.userId) {
      setMessage("Error: User not authenticated");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const venueData = {
        venueName: formData.venueName,
        venueLocation: formData.venueLocation,
        venueCapacity: parseInt(formData.venueCapacity),
        image: formData.image,
        custodian: { userId: user.userId } // FIXED: Use userId instead of custodianId
      };

      console.log('🔵 Creating venue with data:', venueData);

      const response = await fetch("http://localhost:8080/api/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venueData),
      });

      console.log('🔵 Create venue response status:', response.status);

      if (response.ok) {
        const newVenue = await response.json();
        console.log('🟢 Venue created successfully:', newVenue);
        setMessage("Venue added successfully!");
        setFormData({
          venueName: "",
          venueLocation: "",
          venueCapacity: "",
          image: ""
        });
        if (onVenueAdded) {
          onVenueAdded();
        }
      } else {
        const errorText = await response.text();
        console.error('🔴 Error creating venue:', errorText);
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding venue:", error);
      setMessage("Error adding venue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-venue-form">
      <h2>Add New Venue</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="venueName">Venue Name *</label>
          <input
            type="text"
            id="venueName"
            name="venueName"
            value={formData.venueName}
            onChange={handleChange}
            required
            placeholder="e.g., Conference Room A, Auditorium Hall"
          />
        </div>

        <div className="form-group">
          <label htmlFor="venueLocation">Location *</label>
          <input
            type="text"
            id="venueLocation"
            name="venueLocation"
            value={formData.venueLocation}
            onChange={handleChange}
            required
            placeholder="e.g., Main Campus Building, Floor 3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="venueCapacity">Capacity *</label>
          <input
            type="number"
            id="venueCapacity"
            name="venueCapacity"
            value={formData.venueCapacity}
            onChange={handleChange}
            required
            min="1"
            placeholder="Maximum number of persons"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/venue-image.jpg"
          />
          <small>Optional: Provide a direct image URL for the venue</small>
        </div>

        {message && (
          <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? "Adding Venue..." : "Add Venue"}
        </button>
      </form>
    </div>
  );
}