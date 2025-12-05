import React, { useEffect, useState } from "react";
import "../styles/UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(0);
  const size = 150;
  const [totalPages, setTotalPages] = useState(1);

  // EDIT MODAL STATE
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState("");

  // DELETE MODAL STATE
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ADD USER MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "Student",
    about: "",
    location: "",
  });
  const [addError, setAddError] = useState("");

  // Load Users
  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/paged?page=${page}&size=${size}`
      );
      const data = await response.json();

      const list = data.content || data;
      setUsers(Array.isArray(list) ? list : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  // Open Modals
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
    setEditError("");
    setShowEditModal(true);
  };

  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  // VALIDATION (Signup-style)
  const validateAddUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email)
      return "Please fill in all required fields.";

    if (!newUser.userType)
      return "Please select a role.";

    if (!newUser.email.includes("@"))
      return "Invalid email format.";

    return null;
  };

  const validateEditUser = () => {
    if (!editData.firstName || !editData.lastName || !editData.email)
      return "Please fill in all required fields.";

    if (!editData.email.includes("@"))
      return "Invalid email format.";

    return null;
  };

  // CREATE USER
  const createUser = async () => {
    const errorMsg = validateAddUser();
    if (errorMsg) {
      setAddError(errorMsg);
      return;
    }

    setAddError("");

    try {
      await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      setShowAddModal(false);

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        userType: "Student",
        about: "",
        location: "",
      });

      loadUsers();
    } catch (err) {
      setAddError("Failed to create user. Please try again.");
    }
  };

  // UPDATE USER
  const saveChanges = async () => {
    const errorMsg = validateEditUser();
    if (errorMsg) {
      setEditError(errorMsg);
      return;
    }

    setEditError("");

    try {
      await fetch(`http://localhost:8080/api/users/${selectedUser.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      setShowEditModal(false);
      loadUsers();
    } catch (err) {
      setEditError("Failed to update user. Please try again.");
    }
  };

  // DELETE USER
  const deleteUser = async () => {
    try {
      await fetch(`http://localhost:8080/api/users/${deleteUserId}`, {
        method: "DELETE",
      });

      setShowDeleteModal(false);
      loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // SEARCH + FILTER
  const filteredUsers = users.filter((u) => {
    const first = (u.firstName || "").toLowerCase();
    const last = (u.lastName || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const role = (u.userType || "").toLowerCase();

    const searchLower = search.toLowerCase();

    const matchesSearch =
      first.includes(searchLower) ||
      last.includes(searchLower) ||
      email.includes(searchLower);

    const matchesFilter =
      filter === "All" || role === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="um-page">
      <h1 className="um-title">User Management</h1>

      {/* SEARCH + FILTER + ADD BUTTON */}
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

        <button
          className="um-btn-add"
          onClick={() => setShowAddModal(true)}
        >
          Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="um-table-container">
        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="um-empty">No users found.</td>
              </tr>
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

        {/* PAGINATION */}
        <div className="um-pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>&lt;</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      </div>

      {/* ============ ADD USER MODAL ============ */}
      {showAddModal && (
        <div className="um-modal-overlay">
          <div className="um-modal-card">

            <button className="um-close-btn" onClick={() => setShowAddModal(false)}>✕</button>

            <h3 className="um-modal-title">Add User</h3>

            {addError && <p className="um-error">{addError}</p>}

            <form
              className="um-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                createUser();
              }}
            >
              <div>
                <label className="um-label">First Name *</label>
                <input
                  required
                  type="text"
                  className="um-input-pill"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Last Name *</label>
                <input
                  required
                  type="text"
                  className="um-input-pill"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Email *</label>
                <input
                  required
                  type="email"
                  className="um-input-pill"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Role *</label>
                <select
                  className="um-select-pill"
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
              </div>

              <div>
                <label className="um-label">About</label>
                <textarea
                  className="um-textarea"
                  value={newUser.about}
                  onChange={(e) =>
                    setNewUser({ ...newUser, about: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Location</label>
                <input
                  type="text"
                  className="um-input-pill"
                  value={newUser.location}
                  onChange={(e) =>
                    setNewUser({ ...newUser, location: e.target.value })
                  }
                />
              </div>

              <div className="um-modal-actions">
                <button
                  type="button"
                  className="um-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="um-btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ EDIT USER MODAL ============ */}
      {showEditModal && (
        <div className="um-modal-overlay">
          <div className="um-modal-card">

            <button className="um-close-btn" onClick={() => setShowEditModal(false)}>✕</button>

            <h3 className="um-modal-title">Edit User</h3>

            {editError && <p className="um-error">{editError}</p>}

            <form
              className="um-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                saveChanges();
              }}
            >
              <div>
                <label className="um-label">First Name *</label>
                <input
                  required
                  className="um-input-pill"
                  type="text"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Last Name *</label>
                <input
                  required
                  className="um-input-pill"
                  type="text"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Email *</label>
                <input
                  required
                  type="email"
                  className="um-input-pill"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Role *</label>
                <select
                  required
                  className="um-select-pill"
                  value={editData.userType}
                  onChange={(e) =>
                    setEditData({ ...editData, userType: e.target.value })
                  }
                >
                  <option value="Admin">Admin</option>
                  <option value="Coordinator">Coordinator</option>
                  <option value="Custodian">Custodian</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div>
                <label className="um-label">About</label>
                <textarea
                  className="um-textarea"
                  value={editData.about}
                  onChange={(e) =>
                    setEditData({ ...editData, about: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="um-label">Location</label>
                <input
                  className="um-input-pill"
                  type="text"
                  value={editData.location}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                />
              </div>

              <div className="um-modal-actions">
                <button
                  type="button"
                  className="um-btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="um-btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ DELETE USER MODAL ============ */}
      {showDeleteModal && (
        <div className="um-modal-overlay">
          <div className="um-modal-card small">

            <button className="um-close-btn" onClick={() => setShowDeleteModal(false)}>✕</button>

            <h3 className="um-modal-title">Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>

            <div className="um-modal-actions">
              <button
                className="um-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="um-btn-primary"
                onClick={deleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
