import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { authAPI } from "../api.js";
import "../styles/SignInModal.css";
import CustomModal from "./CustomModal";
import ChangePasswordModal from "./ChangePasswordModal"; // new

export default function SignInModal({ onClose, openSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [closeAfterModal, setCloseAfterModal] = useState(false);

  // Force-change-password modal state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pendingUser, setPendingUser] = useState(null); // user object coming from backend

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
      // call your auth API
      const response = await authAPI.signIn({
        email: form.email,
        password: form.password,
      });

      // store token & user (so we can call change-password endpoint)
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));

      const loginEvent = new Event("loginStatusChange");
      window.dispatchEvent(loginEvent);

      // if firstLogin flag set -> force change password
      const user = response.user;
      if (user && user.firstLogin) {
        // keep sign-in modal open until password changed
        setPendingUser(user);
        setShowChangePassword(true);
        // show a temporary message
        handleAction("You must change your password before continuing.", false);
        // DO NOT call login(user) yet — we'll call after password is successfully changed
        return;
      }

      // normal flow
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

  // Called by ChangePasswordModal when user submits a new password
  const handleChangePasswordSave = async (newPassword) => {
    if (!pendingUser) {
      throw new Error("No pending user");
    }

    try {
      // call backend endpoint to change password
      const userId = pendingUser.userId || pendingUser.id; // depending on backend field name
      const res = await fetch(`http://localhost:8080/api/users/${userId}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to change password");
      }

      // update local copy of user and mark firstLogin false
      const updatedUser = { ...pendingUser, firstLogin: false };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // close change password modal, then close sign-in modal and proceed to login
      setShowChangePassword(false);
      setPendingUser(null);
      handleAction("Password updated. Login successful.", true);
      login(updatedUser);

    } catch (err) {
      // bubble error back to ChangePasswordModal via thrown error
      throw err;
    }
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

      {showChangePassword && pendingUser && (
        <ChangePasswordModal
          userId={pendingUser.userId || pendingUser.id}
          onClose={() => {
            setShowChangePassword(false);
            // keep sign-in modal open — user must change password
          }}
          onSave={handleChangePasswordSave}
        />
      )}
    </>
  );
}
