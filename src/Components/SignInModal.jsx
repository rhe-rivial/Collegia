import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { authAPI } from "../api";
import axios from "axios";
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

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

const enrichBooking = (booking) => {
  const toLocaleTime = (t) => {
    if (!t || typeof t !== "string") return "";
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m || 0, 0, 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return {
    ...booking,
    venueName: booking.venue?.venueName || "Unknown Venue",
    eventDate: new Date(booking.date).toLocaleDateString(),
    startTime: toLocaleTime(booking.timeSlot || "09:00"),
    endTime: toLocaleTime("10:00"), // fallback if not available
    duration: `${toLocaleTime(booking.timeSlot || "09:00")} - ${toLocaleTime("10:00")}`,
    guests: `${booking.capacity || 0} pax`,
    bookedBy: booking.user?.firstName || "You",
    status: booking.status ? "confirmed" : "pending",
    image: "/images/default.jpg"
  };
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = {
        email: form.email,
        password: form.password,
      };

      const response = await authAPI.signIn(credentials);

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      localStorage.setItem("userId", String(response.user.userId));

      // Fetch bookings for this user
      const userId = response.user.userId;
      const bookingsResp = await axios.get(
        `http://localhost:8080/api/bookings/user/${userId}`,
        { headers: { Authorization: `Bearer ${response.token}` } }
      );

      const data = bookingsResp?.data;
      const normalized =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.bookings)
          ? data.bookings
          : Array.isArray(data?.content)
          ? data.content
          : [];

      console.log("Fetched bookings normalized:", normalized);
      const enriched = normalized.map(enrichBooking);
      localStorage.setItem("userBookings", JSON.stringify(enriched));

      window.dispatchEvent(new Event("bookingUpdated"));
      window.dispatchEvent(new Event("loginStatusChange"));

      handleAction("Login successful", true);
      login(response.user);
    } catch (err) {
      const message = err?.message || "Login failed. Please check your credentials.";
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

      <CustomModal isOpen={isModalOpen} message={modalMessage} onClose={handleCloseModal} />
    </>
  );
}
