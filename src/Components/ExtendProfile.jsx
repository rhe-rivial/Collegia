import React from "react";
import "../styles/ExtendProfile.css";
import { useNavigate } from "react-router-dom";


export default function ExtendProfile({ user, isEditing }) {
    const navigate = useNavigate();
  return (
    <div className="extend-card">

      {!isEditing && (
        <div className="extend-view">
          <h2>Hello, {user.name}</h2>
          <p className="joined">Joined in {user.joined}</p>

          <button className="edit-btn" onClick={() => navigate("/account/edit")}>
            Edit Profile
          </button>

          <p className="booking-count">{user.bookings.length} Booking(s)</p>
        </div>
      )}

      {isEditing && (
        <div className="extend-edit">
          <h2>Hello, {user.name}</h2>
          <p className="joined">Joined in {user.joined}</p>

          <label>About</label>
          <textarea defaultValue={user.about}></textarea>

          <label>Location</label>
          <input type="text" defaultValue={user.location} />

          <label>Work</label>
          <input type="text" defaultValue={user.work} />

          <p className="note">All the required user information can be added here...</p>

          <div className="edit-actions">
            <button className="cancel-btn" onClick={() => navigate("/account")}>
                Cancel
            </button>

            <button className="save-btn" onClick={() => navigate("/account")}>
                Save
            </button>
           </div>
        </div>
      )}

    </div>
  );
}
