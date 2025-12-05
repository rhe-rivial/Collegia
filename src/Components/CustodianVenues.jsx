import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import ManageVenues from "./ManageVenues";
import AddVenueForm from "./AddVenueForm"; // Import the AddVenueForm component
import apiCall from "../api.js";
import "../styles/CustodianVenues.css";
import "../styles/AddVenueForm.css";

export default function CustodianVenues() {
  const { user } = useContext(UserContext);
  const [myVenues, setMyVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to control form visibility

  useEffect(() => {
    if (user?.userId) {
      fetchMyVenues();
    }
  }, [user]);

  const fetchMyVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const venues = await apiCall(`/venues/custodian/${user.userId}`);
      setMyVenues(Array.isArray(venues) ? venues : []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError("Failed to load venues. Please try again.");
      setMyVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueAdded = () => {
    // Refresh the venues list
    fetchMyVenues();
    // Hide the form
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const isCustodian = user && (user.userType === "Custodian" || user.userType === "custodian" || user.userType === "CUSTODIAN");

  if (!isCustodian) {
    return (
      <div className="custodian-venues">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This section is only available for custodians.</p>
        </div>
      </div>
    );
  }

  return (
<div className="custodian-venues">
  <div className="venues-header">
    <h1>My Venues ({myVenues.length})</h1>
    
    {/* Toggle Button only if there are venues */}
    {myVenues.length > 0 && (
      <button 
        className={`toggle-btn ${showAddForm ? 'cancel' : 'add'}`}
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Cancel' : '+ Add New Venue'}
      </button>
    )}
  </div>
  
  {showAddForm ? (
    <AddVenueForm onVenueAdded={handleVenueAdded} />
  ) : (
    <ManageVenues 
      venues={myVenues} 
      loading={loading}
      onVenueUpdated={fetchMyVenues}
    />
  )}
</div>
  );
}