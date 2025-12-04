import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import AddVenueForm from "./AddVenueForm";
import ManageVenues from "./ManageVenues";
import "../styles/CustodianDashboard.css";

export default function CustodianDashboard() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("add");
  const [myVenues, setMyVenues] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if user is a custodian
  const isCustodian = user && (user.userType === "Custodian" || user.userType === "CUSTODIAN");

  useEffect(() => {
    if (isCustodian) {
      fetchMyVenues();
    }
  }, [isCustodian]);

  const fetchMyVenues = async () => {
    if (!user?.userId) return;
    
    setLoading(true);
    try {
      // FIXED: Use the correct endpoint
      const response = await fetch(`http://localhost:8080/api/venues/custodian/${user.userId}`);
      console.log('🔵 Fetching venues for custodian ID:', user.userId);
      
      if (response.ok) {
        const venues = await response.json();
        console.log('🟢 Venues fetched successfully:', venues);
        setMyVenues(venues);
      } else {
        console.error('🔴 Failed to fetch venues, status:', response.status);
        // If the endpoint doesn't exist, try the main venues endpoint
        const allVenuesResponse = await fetch('http://localhost:8080/api/venues');
        if (allVenuesResponse.ok) {
          const allVenues = await allVenuesResponse.json();
          console.log('🟡 Using all venues as fallback:', allVenues);
          setMyVenues(allVenues);
        }
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isCustodian) {
    return (
      <div className="custodian-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>This section is only available for custodians.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custodian-dashboard">
      <div className="dashboard-header">
        <h1>Venue Management Dashboard</h1>
        <p>Welcome, {user.firstName} {user.lastName}</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add New Venue
        </button>
        <button 
          className={`tab-button ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage My Venues ({myVenues.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "add" && (
          <AddVenueForm onVenueAdded={fetchMyVenues} />
        )}
        
        {activeTab === "manage" && (
          <ManageVenues 
            venues={myVenues} 
            loading={loading}
            onVenueUpdated={fetchMyVenues}
          />
        )}
      </div>
    </div>
  );
}