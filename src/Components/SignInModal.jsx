import React, { useState, useEffect } from "react";
import "../styles/SignInModal.css";

export default function SignInModal({ onClose, setIsLoggedIn, openSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Close on ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("collegia_user"));

    if (!savedUser) return setError("No account found. Please sign up.");
    if (form.email !== savedUser.email) return setError("Email not found.");
    if (form.password !== savedUser.password)
      return setError("Incorrect password.");

    alert("Login Successfully!");
    setIsLoggedIn(true);
    onClose();
  };

  // ⭐ Smooth transition (matches SignUp → SignIn behavior)
  const smoothlySwitchToSignup = () => {
    onClose();     // close THIS modal
    openSignUp();  // instantly open Sign Up (same smoothness as before)
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h3 className="modal-title">Sign in</h3>
        </div>

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
          />

          <label className="label">Password</label>
          <input
            className="input-pill"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" className="btn-continue">
            Continue
          </button>
        </form>

        <hr className="divider" />

        <div className="switch-row">
          <p>
            Don’t have an account?{" "}
            <button
              className="link-button"
              onClick={smoothlySwitchToSignup}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
