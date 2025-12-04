import React, { useEffect, useState } from "react";
import "../styles/UserManagement.css"; 
import { userAPI } from "../api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load all users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      about: user.about || "",
      location: user.location || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const saveChanges = async () => {
    try {
      await userAPI.updateUser(selectedUser.userId, editData);
      setShowEditModal(false);
      loadUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const deleteUser = async () => {
    try {
      await userAPI.deleteUser(deleteUserId);
      setShowDeleteModal(false);
      loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // Search + Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || u.userType.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="um-page">
      <h1 className="um-title">User Management</h1>

      {/* SEARCH + FILTER */}
      <div className="um-controls">
        <input
          className="um-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
        />

        <select
          className="um-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Admin</option>
          <option>Coordinator</option>
          <option>Custodian</option>
          <option>Faculty</option>
          <option>Student</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="um-table-container">
        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="um-empty">No users found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.userType}</td>
                  <td>
                    <button className="um-btn-edit" onClick={() => openEditModal(user)}>Edit</button>
                    <button className="um-btn-delete" onClick={() => openDeleteModal(user.userId)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT USER MODAL */}
      {showEditModal && (
        <div className="um-modal-overlay">
          <div className="um-modal-card">
            <h3>Edit User</h3>

            <input
              type="text"
              value={editData.firstName}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
              placeholder="First Name"
            />

            <input
              type="text"
              value={editData.lastName}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
              placeholder="Last Name"
            />

            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              placeholder="Email"
            />

            <select
              value={editData.userType}
              onChange={(e) => setEditData({ ...editData, userType: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Custodian">Custodian</option>
              <option value="Faculty">Faculty</option>
              <option value="Student">Student</option>
            </select>

            <textarea
              placeholder="About"
              value={editData.about}
              onChange={(e) => setEditData({ ...editData, about: e.target.value })}
            />

            <input
              type="text"
              placeholder="Location"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            />

            <div className="um-edit-actions">
              <button className="um-btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="um-btn-save" onClick={saveChanges}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="um-modal-overlay">
          <div className="um-modal-card small">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>

            <div className="um-delete-actions">
              <button className="um-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="um-btn-delete" onClick={deleteUser}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
