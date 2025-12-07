import React, { useEffect, useState } from "react";
import "../styles/UserManagement.css";
import * as XLSX from "xlsx";

import UserSearchAndFilter from "./UserSearchAndFilter";
import UserAddModal from "./UserAddModal";
import UserEditModal from "./UserEditModal";
import UserExcelModal from "./UserExcelModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [excelMessage, setExcelMessage] = useState("");
  const [excelError, setExcelError] = useState("");


  // Pagination
  const [page, setPage] = useState(0);
  const size = 150;
  const [totalPages, setTotalPages] = useState(1);

  // ADD Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState("");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "Student",
    about: "",
    location: "",
  });

  // EDIT Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});

  // DELETE Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // EXCEL Modal
  const [showExcelModal, setShowExcelModal] = useState(false);

  /* ==============================
            LOAD USERS
  =============================== */
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

  /* ==============================
            SEARCH + FILTER
  =============================== */
  const filteredUsers = users.filter((u) => {
    const first = (u.firstName || "").toLowerCase();
    const last = (u.lastName || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const role = (u.userType || "").toLowerCase();
    const query = search.toLowerCase();

    const matchSearch =
      first.includes(query) ||
      last.includes(query) ||
      email.includes(query);

    const matchFilter =
      filter === "All" || role === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  /* ==============================
            ADD USER
  =============================== */
  const validateAddUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email)
      return "Please fill in all required fields.";

    if (!newUser.email.includes("@"))
      return "Invalid email format.";

    return null;
  };

  const createUser = async () => {
    const err = validateAddUser();
    if (err) return setAddError(err);

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

  /* ==============================
            EDIT USER
  =============================== */
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

  const validateEditUser = () => {
    if (!editData.firstName || !editData.lastName || !editData.email)
      return "Please fill in all required fields.";
    if (!editData.email.includes("@"))
      return "Invalid email format.";
    return null;
  };

  const saveChanges = async () => {
    const err = validateEditUser();
    if (err) return setEditError(err);

    try {
      await fetch(
        `http://localhost:8080/api/users/${selectedUser.userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );

      setShowEditModal(false);
      loadUsers();

    } catch (err) {
      setEditError("Failed to update user. Please try again.");
    }
  };

  /* ==============================
            DELETE USER
  =============================== */
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

  // Excel Import
  const uploadExcel = async (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Reset messages
      setExcelMessage("");
      setExcelError("");

      try {
        const res = await fetch("http://localhost:8080/api/users/import-excel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rows)
        });

        const message = await res.text();

        if (res.ok) {
          setExcelMessage(message);

          setTimeout(() => {
            setShowExcelModal(false);
            setExcelMessage("");
            loadUsers();
          }, 1500);

        } else {
          setExcelError(message || "Import failed.");
        }

      } catch (err) {
        console.error(err);
        setExcelError("Import failed. Please check the file format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };



  /* ==============================
            RENDER
  =============================== */
  return (
    <div className="um-page">

      <h1 className="um-title">User Management</h1>

      {/* SEARCH + FILTER + ACTIONS */}
      <UserSearchAndFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        onAddUser={() => setShowAddModal(true)}
        onExcelUpload={() => setShowExcelModal(true)}
      />

      {/* USER TABLE */}
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
                    <button
                      className="um-btn-edit"
                      onClick={() => openEditModal(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="um-btn-delete"
                      onClick={() => {
                        setDeleteUserId(user.userId);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
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

      {/* ========= ADD USER MODAL ========= */}
      {showAddModal && (
        <UserAddModal
          newUser={newUser}
          setNewUser={setNewUser}
          addError={addError}
          onClose={() => setShowAddModal(false)}
          onSave={createUser}
        />
      )}

      {/* ========= EDIT USER MODAL ========= */}
      {showEditModal && (
        <UserEditModal
          editData={editData}
          setEditData={setEditData}
          editError={editError}
          onClose={() => setShowEditModal(false)}
          onSave={saveChanges}
        />
      )}

      {/* ========= EXCEL IMPORT MODAL ========= */}
      {showExcelModal && (
        <UserExcelModal
          onClose={() => setShowExcelModal(false)}
          onUploadExcel={uploadExcel}
          excelMessage={excelMessage}
          excelError={excelError}
        />
      )}

      {/* ========= DELETE CONFIRM MODAL ========= */}
      {showDeleteModal && (
        <div className="um-modal-overlay">
          <div className="um-modal-card small">
            <button className="um-close-btn" onClick={() => setShowDeleteModal(false)}>✕</button>
            <h3 className="um-modal-title">Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>

            <div className="um-modal-actions">
              <button className="um-btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="um-btn-primary" onClick={deleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
