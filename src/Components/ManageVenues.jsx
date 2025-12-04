import React, { useState } from "react";
import "../styles/ManageVenues.css";

export default function ManageVenues({ venues, loading, onVenueUpdated }) {
  const [editingVenue, setEditingVenue] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (venue) => {
    setEditingVenue(venue.venueId);
    setEditForm({
      venueName: venue.venueName,
      venueLocation: venue.venueLocation,
      venueCapacity: venue.venueCapacity,
      image: venue.image || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingVenue(null);
    setEditForm({});
  };

  const handleUpdate = async (venueId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/venues/${venueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editForm,
          venueCapacity: parseInt(editForm.venueCapacity)
        }),
      });

      if (response.ok) {
        setEditingVenue(null);
        setEditForm({});
        if (onVenueUpdated) {
          onVenueUpdated();
        }
      } else {
        alert("Error updating venue");
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      alert("Error updating venue");
    }
  };

  const handleDelete = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/venues/${venueId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onVenueUpdated) {
          onVenueUpdated();
        }
      } else {
        alert("Error deleting venue");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      alert("Error deleting venue");
    }
  };

  if (loading) {
    return <div className="manage-venues">Loading venues...</div>;
  }

  return (
    <div className="manage-venues">
      <h2>My Venues</h2>
      
      {venues.length === 0 ? (
        <div className="no-venues">
          <p>You haven't added any venues yet.</p>
          <p>Start by adding your first venue using the "Add New Venue" tab.</p>
        </div>
      ) : (
        <div className="venues-list">
          {venues.map((venue) => (
            <div key={venue.venueId} className="venue-card">
              {editingVenue === venue.venueId ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editForm.venueName}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        venueName: e.target.value
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editForm.venueLocation}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        venueLocation: e.target.value
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input
                      type="number"
                      value={editForm.venueCapacity}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        venueCapacity: e.target.value
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={editForm.image}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        image: e.target.value
                      }))}
                    />
                  </div>
                  <div className="edit-actions">
                    <button 
                      className="save-btn"
                      onClick={() => handleUpdate(venue.venueId)}
                    >
                      Save
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="venue-image">
                    <img 
                      src={venue.image || "/images/Dining-room.jpg"} 
                      alt={venue.venueName}
                    />
                  </div>
                  <div className="venue-info">
                    <h3>{venue.venueName}</h3>
                    <p><strong>Location:</strong> {venue.venueLocation}</p>
                    <p><strong>Capacity:</strong> {venue.venueCapacity} persons</p>
                  </div>
                  <div className="venue-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(venue)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(venue.venueId)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}