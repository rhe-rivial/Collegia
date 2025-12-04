import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { authAPI } from "../api";
import "../styles/SignInModal.css";
import CustomModal from "./CustomModal";

export default function SignInModal({ onClose, openSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);

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
    }
  };

  // FIX: prevent modal from closing during text selection
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.signIn({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));

      const loginEvent = new Event("loginStatusChange");
      window.dispatchEvent(loginEvent);

      handleAction("Login successful", true);
      login(response.user);

    } catch (err) {
      const message =
        err?.message || "Login failed. Please check your credentials.";
      setError(message);
      handleAction(message, false);
    } finally {
      setIsLoading(false);
    }
  };

  const smoothlySwitchToSignup = () => {
    onClose();
    openSignUp();
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>

          <h2 className="signin-title ">Sign In</h2>
         
          {error && <p className="error-text">{error}</p>}

          <form className="modal-form" onSubmit={handleSubmit}>
            <label className="label">Email</label>
            <input
              className="input-pill"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label className="label">Password</label>
            <input
              className="input-pill"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-continue" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Continue"}
            </button>
          </form>

          <hr className="divider" />

          <div className="switch-row">
            <p>
              Don't have an account?{" "}
              <button className="link-button" onClick={smoothlySwitchToSignup}>
                Sign up here
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
