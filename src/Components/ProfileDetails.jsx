import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import "../styles/ProfileDetails.css";

export default function ProfileDetails() {
  const { user } = useContext(UserContext);

  return (
    <div className="profile-details-card">
      <div className="profile-photo">
        <img src="/images/default-profile.jpg" alt="Profile" />
      </div>

      <h2 className="profile-name">{user.name}</h2>

      <div className="profile-section">
        <h4>About</h4>
        <p>{user.about}</p>
      </div>

      <div className="profile-section">
        <h4>Location</h4>
        <p>{user.location}</p>
      </div>

      <div className="profile-section">
        <h4>Work</h4>
        <p>{user.work}</p>
      </div>
    </div>
  );
}
