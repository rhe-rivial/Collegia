import React, { useState } from "react";
import EditVenueModal from "./EditVenueModal";
import CustomModal from "./CustomModal";
import "../styles/CustodianVenues.css";

export default function ManageVenues({ venues, loading, onVenueUpdated }) {
  const [editingVenue, setEditingVenue] = useState(null);
  const [deleteVenueId, setDeleteVenueId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (venue) => {
    setEditingVenue(venue);
  };

  const handleCancelEdit = () => {
    setEditingVenue(null);
  };

  const handleUpdate = (updatedVenue) => {
    setEditingVenue(null);
    if (onVenueUpdated) {
      onVenueUpdated();
    }
  };

  const handleDeleteClick = (venueId) => {
    setDeleteVenueId(venueId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteVenueId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/venues/${deleteVenueId}`, {
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
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteVenueId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteVenueId(null);
  };

  if (loading) {
    return (
      <div className="manage-venues">
        <div className="loading-venues">
          <div className="loading-spinner"></div>
          <p>Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-venues">
          {venues.length === 0 ? (
        <div className="no-venues">
          <h3>No Venues Yet</h3>
          <p>You haven't added any venues yet.</p>
          <p>Start by adding your first venue using the "Add New Venue" tab.</p>
        </div>
      ) : (
        <>
          <div className="venues-grid">
            {venues.map((venue) => (
              <div key={venue.venueId} className="venue-card">
                <div className="venue-image">
                  <img 
                    src={venue.image || "/images/Dining-room.jpg"} 
                    alt={venue.venueName}
                  />
                  <div className="venue-badge">
                    {venue.venueCapacity} persons
                  </div>
                </div>
                
                <div className="venue-info">
                  <h3>{venue.venueName}</h3>
                  <div className="venue-location">
                    {venue.venueLocation}
                  </div>
                  
                  {venue.description && (
                    <p className="venue-description">
                      {venue.description.length > 100 
                        ? `${venue.description.substring(0, 100)}...` 
                        : venue.description}
                    </p>
                  )}
                  
                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="venue-amenities">
                      <div className="amenities-label">Amenities:</div>
                      <div className="amenities-list">
                        {venue.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                        {venue.amenities.length > 3 && (
                          <span className="amenity-tag more">
                            +{venue.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
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
                    onClick={() => handleDeleteClick(venue.venueId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Venue Modal */}
      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          onClose={handleCancelEdit}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        message="Are you sure you want to delete this venue? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}