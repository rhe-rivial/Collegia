import { useState } from "react";
import { authAPI } from "../api";
import "../styles/SignUpModal.css";
import CustomModal from "./CustomModal";

export default function SignUpModal({ onClose, openSignIn }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    course: "",
    organization: "",
    affiliation: "",
    department: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // CustomModal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [closeAfterModal, setCloseAfterModal] = useState(false);

  const handleAction = (message, shouldCloseParent = false) => {
    setModalMessage(message);
    setCloseAfterModal(shouldCloseParent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage("");

    if (closeAfterModal) {
      setCloseAfterModal(false);
      onClose();
      openSignIn();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword)
      return "Please fill in all required fields.";

    if (!form.userType) return "Please select a role.";

    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";

    if (form.password.length < 6)
      return "Password must be at least 6 characters long.";

    if (form.userType === "Student") {
      if (!form.course || !form.organization)
        return "Course and Organization are required for Students.";
    }

    if (form.userType === "Coordinator") {
      if (!form.affiliation) return "Affiliation is required for Coordinators.";
    }

    if (form.userType === "Faculty") {
      if (!form.department) return "Department is required for Faculty.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const err = validate();
    if (err) {
      setError(err);
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        userType: form.userType,
        ...(form.userType === "Student" && { course: form.course, organization: form.organization }),
        ...(form.userType === "Coordinator" && { affiliation: form.affiliation }),
        ...(form.userType === "Faculty" && { department: form.department }),
      };

      await authAPI.signUp(userData);

      handleAction("Account created successfully!", true);

    } catch (err) {
      const message = err?.message || "Sign up failed. Please try again.";
      setError(message);
      handleAction(message, false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>

          <h2 className="signup-title">Sign Up</h2>

          {error && <p className="error-text">{error}</p>}

          <form className="modal-form" onSubmit={handleSubmit}>

            <label className="label">First Name *</label>
                <input
                  className="input-pill"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
            
            <label className="label">Last Name *</label>
                <input
                  className="input-pill"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />

            <label className="label">Email *</label>
            <input
              className="input-pill"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />

            <label className="label">Password *</label>
            <input
              className="input-pill"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password (min. 6 characters)"
              required
            />

            <label className="label">Confirm Password *</label>
            <input
              className="input-pill"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

            <label className="label">Role *</label>
            <select
              className="input-pill"
              name="userType"
              value={form.userType}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Faculty">Faculty</option>
            </select>

            {form.userType === "Student" && (
              <>
                <label className="label">Course *</label>
                <input
                  className="input-pill"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g., BSIT, BMMA"
                  required
                />

                <label className="label">Organization *</label>
                <input
                  className="input-pill"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="e.g., CCS, CNAHS"
                  required
                />
              </>
            )}

            {form.userType === "Coordinator" && (
              <>
                <label className="label">Affiliation *</label>
                <input
                  className="input-pill"
                  name="affiliation"
                  value={form.affiliation}
                  onChange={handleChange}
                  placeholder="Enter company or organization name"
                  required
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
                  required
                />
              </>
            )}

            <button 
              type="submit" 
              className="btn-continue"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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

      <CustomModal 
        isOpen={isModalOpen} 
        message={modalMessage} 
        onClose={handleCloseModal} 
      />
    </>
  );
}