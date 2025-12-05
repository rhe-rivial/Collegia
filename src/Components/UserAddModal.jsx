import React from "react";
import "../styles/UserModal.css";

export default function UserAddModal({
  newUser,
  setNewUser,
  addError,
  onClose,
  onSave
}) {
  return (
    <div className="umod-overlay">
      <div className="umod-card">

        <button className="umod-close" onClick={onClose}>✕</button>

        <h3 className="umod-title">Add User</h3>

        {addError && <p className="umod-error">{addError}</p>}

        <form
          className="umod-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >

          <label className="umod-label">First Name *</label>
          <input
            className="umod-input"
            value={newUser.firstName}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
          />

          <label className="umod-label">Last Name *</label>
          <input
            className="umod-input"
            value={newUser.lastName}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
          />

          <label className="umod-label">Email *</label>
          <input
            className="umod-input"
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />

          <label className="umod-label">Role *</label>
          <select
            className="umod-select"
            value={newUser.userType}
            onChange={(e) =>
              setNewUser({ ...newUser, userType: e.target.value })
            }
          >
            <option value="Admin">Admin</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Custodian">Custodian</option>
            <option value="Faculty">Faculty</option>
            <option value="Student">Student</option>
          </select>

          <label className="umod-label">About</label>
          <textarea
            className="umod-textarea"
            value={newUser.about}
            onChange={(e) =>
              setNewUser({ ...newUser, about: e.target.value })
            }
          />

          <label className="umod-label">Location</label>
          <input
            className="umod-input"
            value={newUser.location}
            onChange={(e) =>
              setNewUser({ ...newUser, location: e.target.value })
            }
          />

          <div className="umod-actions">
            <button
              type="button"
              className="umod-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="umod-btn-primary">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
