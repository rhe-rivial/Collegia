import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import ManageVenues from "./ManageVenues";
import  apiCall  from "../api.js";
import "../styles/CustodianVenues.css";

export default function CustodianVenues() {
  const { user } = useContext(UserContext);
  const [myVenues, setMyVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <p>Manage all venues under your responsibility</p>
        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchMyVenues} className="retry-btn">
              Retry
            </button>
          </div>
        )}
      </div>
      
      <ManageVenues 
        venues={myVenues} 
        loading={loading}
        onVenueUpdated={fetchMyVenues}
      />
    </div>
  );
}