import React, { useContext, useState, useEffect } from "react";
import "../styles/ExtendProfile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { bookingAPI } from "../api";

export default function ExtendProfile({ isEditing }) {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (!user || !user.userId) {
      return;
    }

    const loadBookingCount = async () => {
      try {
        const userBookings = await bookingAPI.getUserBookings(user.userId);
        const validBookings = Array.isArray(userBookings) ? userBookings : [];
        setBookingCount(validBookings.length);
      } catch (error) {
        console.error("Error loading booking count:", error);
        setBookingCount(0);
      }
    };

    loadBookingCount();
  }, [user]); 

  if (!user) {
    return (
      <div className="extend-card">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleSave = (formData) => {
    updateUser(formData);
    navigate("/account");
  };

  return (
    <div className="extend-card">
      {!isEditing && (
        <div className="extend-view">
          <h2>Hello, {user.name}</h2>
          <p className="joined">Joined in {user.joined || "2025"}</p>

          <button className="ep-edit-btn" onClick={() => navigate("/account/edit")}>
            Edit Profile
          </button>

          <p className="booking-count">{bookingCount} Booking{bookingCount !== 1 ? 's' : ''}</p>
        </div>
      )}

      {isEditing && (
        <EditForm user={user} onSave={handleSave} onCancel={() => navigate("/account")} />
      )}
    </div>
  );
}

function EditForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = React.useState({
    about: user.about || "",
    location: user.location || "",
    work: user.work || ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="extend-edit">
      <h2>Hello, {user.name}</h2>
      <p className="joined">Joined in {user.joined || "2025"}</p>

      <label>About</label>
      <textarea 
        name="about"
        value={formData.about} 
        onChange={handleInputChange}
      />

      <label>Location</label>
      <input 
        type="text" 
        name="location"
        value={formData.location} 
        onChange={handleInputChange}
      />

      <label>Work</label>
      <input 
        type="text" 
        name="work"
        value={formData.work} 
        onChange={handleInputChange}
      />

      <p className="note">All the required user information can be added here...</p>

      <div className="edit-actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="save-btn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}
