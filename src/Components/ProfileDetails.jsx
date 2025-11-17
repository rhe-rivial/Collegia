import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import "../styles/ProfileDetails.css";
export default function ProfileDetails() {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div className="profile-details-card">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="profile-details-card">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-details-card">
      <div className="profile-photo">
        <img src="/images/default-profile.jpg" alt="Profile" />
      </div>

      <h2 className="profile-name">{user.name || `${user.firstName} ${user.lastName}`}</h2>
      
      <div className="profile-section">
        <h4>Email</h4>
        <p>{user.email}</p>
      </div>

      <div className="profile-section">
        <h4>User Type</h4>
        <p>{user.userType}</p>
      </div>

      <div className="profile-section">
        <h4>About</h4>
        <p>{user.about || "No information provided"}</p>
      </div>

      <div className="profile-section">
        <h4>Location</h4>
        <p>{user.location || "No location provided"}</p>
      </div>

      <div className="profile-section">
        <h4>Work</h4>
        <p>{user.work || "No work information provided"}</p>
      </div>
    </div>
  );
}