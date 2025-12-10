import React, { useContext, useState, useEffect } from "react";
import "../styles/ExtendProfile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { bookingAPI, userAPI } from "../api.js";
import CustomModal from "./CustomModal";

export default function ExtendProfile({ isEditing }) {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const [bookingCount, setBookingCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSave = async (formData) => {
    try {
      // Update user data via API
      const updatedUser = await updateUser(formData);
      setSuccessMessage("Profile updated successfully!");
      setShowSuccessModal(true);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/account");
      }, 1500);
      
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="extend-card">
      {!isEditing && (
        <div className="extend-view">
          <h2>Hello, {user.name}</h2>
          
          <button className="ep-edit-btn" onClick={() => navigate("/account/edit")}>
            Edit Profile
          </button>

          <p className="booking-count">{bookingCount} Booking{bookingCount !== 1 ? 's' : ''}</p>
        </div>
      )}

      {isEditing && (
        <EditForm 
          user={user} 
          onSave={handleSave} 
          onCancel={() => navigate("/account")}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          setShowSuccessModal={setShowSuccessModal}
          setShowErrorModal={setShowErrorModal}
        />
      )}

      {/* Success Modal */}
      <CustomModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <CustomModal
        isOpen={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}

function EditForm({ user, onSave, onCancel, setSuccessMessage, setErrorMessage, setShowSuccessModal, setShowErrorModal }) {
  const [formData, setFormData] = useState({
    about: user.about || "",
    location: user.location || "",
    work: user.work || ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      let photoUploadSuccess = false;
      
      if (photoFile) {
        // If there's a new photo, upload it first
        setIsUploading(true);
        try {
          const photoFormData = new FormData();
          photoFormData.append("photo", photoFile);
          
          const response = await fetch(`http://localhost:8080/api/users/${user.userId}/profile-photo`, {
            method: "PUT",
            body: photoFormData,
          });

          if (response.ok) {
            const data = await response.json();
            photoUploadSuccess = true;
            // Show immediate success message for photo upload
            setSuccessMessage("Profile photo uploaded successfully!");
            setShowSuccessModal(true);
          } else {
            const errorData = await response.text();
            throw new Error(errorData || "Failed to upload photo");
          }
        } catch (error) {
          console.error("Error uploading photo:", error);
          setErrorMessage(error.message || "Failed to upload profile photo. Please try again.");
          setShowErrorModal(true);
          setIsUploading(false);
          return; // Stop if photo upload fails
        } finally {
          setIsUploading(false);
        }
      }

      // Save the rest of the user data
      await onSave(formData);
      
      // If both photo upload and profile update succeeded
      if (photoUploadSuccess) {
        setSuccessMessage("Profile and photo updated successfully!");
        setShowSuccessModal(true);
      }
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage("Failed to save changes. Please try again.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="extend-edit">
      <h2>Edit Profile</h2>
      <p className="joined">Update your personal information</p>

      {/* Photo Upload in Edit Mode */}
      <div className="edit-photo-section">
        <label>Profile Photo</label>
        <div className="edit-photo-container">
          <div className="edit-photo-preview">
            <img 
              src={user.profilePhoto || "/images/default-profile.jpg"} 
              alt="Profile Preview" 
              onError={(e) => {
                e.target.src = "/images/default-profile.jpg";
              }}
            />
          </div>
          <div className="edit-photo-upload">
            <input
              type="file"
              id="edit-photo-upload"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="edit-photo-upload" className="upload-btn">
              {photoFile ? "Change Selected" : "Upload New Photo"}
            </label>
            {photoFile && (
              <p className="photo-file-name">{photoFile.name}</p>
            )}
          </div>
        </div>
      </div>

      <label>About</label>
      <textarea 
        name="about"
        value={formData.about} 
        onChange={handleInputChange}
        placeholder="Tell us about yourself..."
      />

      <label>Location</label>
      <input 
        type="text" 
        name="location"
        value={formData.location} 
        onChange={handleInputChange}
        placeholder="Where are you located?"
      />

      <label>Work</label>
      <input 
        type="text" 
        name="work"
        value={formData.work} 
        onChange={handleInputChange}
        placeholder="What do you do?"
      />

      <div className="ep-edit-actions">
        <button className="ep-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button 
          className="ep-save-btn" 
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}