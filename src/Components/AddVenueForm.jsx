import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import apiCall from "../api";
import "../styles/AddVenueForm.css";

export default function AddVenueForm({ onVenueAdded }) {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    venueName: "",
    venueLocation: "",
    venueCapacity: "",
    image: "",
    description: "",
    amenities: ["Air Conditioner", "WiFi"], // Default amenities
    galleryImages: []
  });
  const [newAmenity, setNewAmenity] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.galleryImages.length > 5) {
      setMessage("Error: Maximum 5 gallery images allowed");
      return;
    }

    const newGalleryFiles = [...galleryFiles, ...files];
    setGalleryFiles(newGalleryFiles);

    // Create temporary URLs for preview
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...newImageUrls]
    }));
  };

  const handleRemoveGalleryImage = (index) => {
    const newGalleryImages = [...formData.galleryImages];
    const newGalleryFiles = [...galleryFiles];
    
    newGalleryImages.splice(index, 1);
    if (index < newGalleryFiles.length) {
      newGalleryFiles.splice(index, 1);
    }
    
    setFormData(prev => ({ ...prev, galleryImages: newGalleryImages }));
    setGalleryFiles(newGalleryFiles);
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const handleAmenityKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAmenity();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.userId) {
      setMessage("Error: User not authenticated");
      return;
    }

    // Validate required fields
    if (!formData.venueName.trim() || !formData.venueLocation.trim() || !formData.venueCapacity) {
      setMessage("Error: Please fill in all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Prepare venue data
      const venueData = {
        venueName: formData.venueName,
        venueLocation: formData.venueLocation,
        venueCapacity: parseInt(formData.venueCapacity),
        image: formData.image,
        description: formData.description || `${formData.venueName} - A versatile venue for various events.`,
        amenities: formData.amenities,
        galleryImages: formData.galleryImages,
        custodian: { userId: user.userId }
      };

      console.log("Submitting venue data:", venueData);

      await apiCall('/venues', {
        method: 'POST',
        body: venueData,
      });

      setMessage("Venue added successfully!");
      
      // Reset form
      setFormData({
        venueName: "",
        venueLocation: "",
        venueCapacity: "",
        image: "",
        description: "",
        amenities: ["Air Conditioner", "WiFi"],
        galleryImages: []
      });
      setImageFile(null);
      setGalleryFiles([]);
      setNewAmenity("");
      setNewGalleryImage("");
      
      if (onVenueAdded) {
        onVenueAdded();
      }
    } catch (error) {
      console.error("Error adding venue:", error);
      setMessage(`Error: ${error.message || "Failed to add venue"}`);
    } finally {
      setLoading(false);
    }
  };

  const commonAmenities = [
    "Air Conditioner", "WiFi", "Projector", "Sound System", 
    "Whiteboard", "Television", "Lighting", "Furniture",
    "Power Outlets", "Microphones", "Stage", "Video Conferencing"
  ];

  return (
    <div className="add-venue-form">
      <h2>Add New Venue</h2>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
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
        </div>

        {/* Description */}
        <div className="form-section">
          <h3>Description</h3>
          
          <div className="form-group">
            <label htmlFor="description">Venue Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the venue, its features, and what it's best suited for..."
            />
          </div>
        </div>

        {/* Main Image */}
        <div className="form-section">
          <h3>Main Image</h3>
          
          <div className="form-group">
            <label htmlFor="image">Image URL or Upload</label>
            <div className="image-input-group">
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/venue-image.jpg"
              />
              <span className="or-text">OR</span>
              <div className="file-upload">
                <label htmlFor="image-upload" className="file-upload-label">
                    <span
                      className="upload-icon"
                      style={{ backgroundImage: 'url(/icons/folder.png)' }}
                    ></span>
                  Choose File
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                {imageFile && (
                  <span className="file-name">{imageFile.name}</span>
                )}
              </div>
            </div>
            <small>Provide a URL or upload an image (Recommended: 1200x800px)</small>
          </div>
          
          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Venue preview" />
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="form-section">
          <h3>Amenities</h3>
          
          <div className="form-group">
            <label>Add Amenities</label>
            <div className="amenity-input-group">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={handleAmenityKeyPress}
                placeholder="Enter an amenity (e.g., Projector)"
                list="common-amenities"
              />
              <datalist id="common-amenities">
                {commonAmenities.map(amenity => (
                  <option key={amenity} value={amenity} />
                ))}
              </datalist>
              <button 
                type="button" 
                className="add-amenity-btn"
                onClick={handleAddAmenity}
              >
                Add
              </button>
            </div>
            
            <div className="amenities-list">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="amenity-tag">
                  <span>{amenity}</span>
                  <button 
                    type="button"
                    className="remove-amenity"
                    onClick={() => handleRemoveAmenity(amenity)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="quick-amenities">
              <small>Quick add:</small>
              {commonAmenities.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  className="quick-amenity-btn"
                  onClick={() => {
                    if (!formData.amenities.includes(amenity)) {
                      setFormData(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity]
                      }));
                    }
                  }}
                  disabled={formData.amenities.includes(amenity)}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        {message && (
          <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Adding Venue...
              </>
            ) : "Add Venue"}
          </button>
          
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => {
              if (window.confirm("Are you sure? All entered data will be lost.")) {
                window.location.reload();
              }
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}