import React, { useState } from "react";
import "../styles/SignUpModal.css";

export default function SignUpModal({ onClose, openSignIn }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    course: "",
    organization: "",
    company: "",
    department: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword)
      return "Please fill in all required fields.";

    if (!form.userType) return "Please select a user type.";

    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";

    // Dynamic fields
    if (form.userType === "Student") {
      if (!form.course || !form.organization)
        return "Course and Organization are required for Students.";
    }

    if (form.userType === "Coordinator") {
      if (!form.company) return "Company Name is required for Coordinators.";
    }

    if (form.userType === "Faculty") {
      if (!form.department) return "Department is required for Faculty.";
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setError(err);

    // Save to localStorage
    localStorage.setItem("collegia_user", JSON.stringify(form));

    alert("Account created successfully!");

    onClose();
    openSignIn();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <h3 className="modal-title">Sign Up</h3>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="label">Full Name *</label>
          <input
            className="input-pill"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <label className="label">Email *</label>
          <input
            className="input-pill"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email address"
          />

          <label className="label">Password *</label>
          <input
            className="input-pill"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
          />

          <label className="label">Confirm Password *</label>
          <input
            className="input-pill"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />

          <label className="label">User Type *</label>
          <select
            className="input-pill"
            name="userType"
            value={form.userType}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            <option value="Student">Student</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Faculty">Faculty</option>
          </select>

          {/* Dynamic Fields */}
          {form.userType === "Student" && (
            <>
              <label className="label">Course *</label>
              <input
                className="input-pill"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g., BSIT, BMMA"
              />

              <label className="label">Organization *</label>
              <input
                className="input-pill"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                placeholder="e.g., CCS, CNAHS"
              />
            </>
          )}

          {form.userType === "Coordinator" && (
            <>
              <label className="label">Affiliated Company *</label>
              <input
                className="input-pill"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </>
          )}

          {form.userType === "Faculty" && (
            <>
              <label className="label">Department *</label>
              <input
                className="input-pill"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Enter department"
              />
            </>
          )}

          <button type="submit" className="btn-continue">
            Create Account
          </button>
        </form>

        <hr className="divider" />

        <div className="switch-row">
          <p>
            Already have an account?{" "}
            <button
              className="link-button"
              onClick={() => {
                onClose();
                openSignIn();
              }}
            >
              Sign in here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
