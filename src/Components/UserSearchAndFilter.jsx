import React from "react";
import "../styles/UserSearchAndFilter.css";

export default function UserSearchAndFilter({
  search,
  setSearch,
  filter,
  setFilter,
  onAddUser,
  onExcelUpload
}) {
  return (
    <div className="usf-controls">

      <input
        className="usf-search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />

      <select
        className="usf-filter"
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

      <button className="usf-btn-add" onClick={onAddUser}>
        Add User
      </button>

      <button className="usf-btn-excel" onClick={onExcelUpload}>
        Import Excel
      </button>

    </div>
  );
}
