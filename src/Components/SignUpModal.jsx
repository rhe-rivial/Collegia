import React, { useEffect, useState } from "react";
import "../styles/SignUpModal.css";

export default function SignUpModal({ onClose, openSignIn }) {
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    organization: "",
    companyName: "",
    department: "",
  });

  // Close modal when pressing ESC
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Handle dynamic inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration Successful!");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h3 className="modal-title">Sign Up</h3>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          {/* FULL NAME */}
          <label className="label">Full Name</label>
          <input
            className="input-pill"
            name="fullname"
            placeholder="Enter your full name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />

          {/* EMAIL */}
          <label className="label">Email</label>
          <input
            className="input-pill"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <label className="label">Password</label>
          <input
            className="input-pill"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* CONFIRM PASSWORD */}
          <label className="label">Confirm Password</label>
          <input
            className="input-pill"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* USER TYPE DROPDOWN */}
          <label className="label">Role</label>
          <select
            className="input-pill"
            name="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Faculty">Faculty</option>
          </select>

          {/* DYNAMIC FIELDS */}

          {userType === "Student" && (
            <>
              <label className="label">Course</label>
              <input
                name="course"
                className="input-pill"
                placeholder="Enter your course"
                value={formData.course}
                onChange={handleChange}
                required
              />

              <label className="label">Organization</label>
              <input
                name="organization"
                className="input-pill"
                placeholder="Enter your organization"
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </>
          )}

          {userType === "Coordinator" && (
            <>
              <label className="label">Affiliated Company Name</label>
              <input
                name="companyName"
                className="input-pill"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </>
          )}

          {userType === "Faculty" && (
            <>
              <label className="label">Department</label>
              <input
                name="department"
                className="input-pill"
                placeholder="Enter your department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button type="submit" className="btn-continue">
            Continue
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
