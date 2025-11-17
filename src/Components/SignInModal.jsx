import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { authAPI } from "../api";
import "../styles/SignInModal.css";

export default function SignInModal({ onClose, setIsLoggedIn, openSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);

  //Please change here because it exits the window when selecting text all the way to the left
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = {
        email: form.email,
        password: form.password
      };

      // api call 
      const response = await authAPI.signIn(credentials);
      
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      
      alert("Login Successful!");
      
      setIsLoggedIn(true);
      login(response.user);
      onClose();
      
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const smoothlySwitchToSignup = () => {
    onClose();
    openSignUp();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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

          <button 
            type="submit" 
            className="btn-continue"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Continue"}
          </button>
        </form>

        <hr className="divider" />

        <div className="switch-row">
          <p>
            Don't have an account?{" "}
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