import React, { useEffect } from "react";
import "../styles/SignUpModal.css";

export default function SignUpModal({ onClose, openSignIn }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with real signup logic
    alert("✅ Account created (demo) — closing modal.");
    onClose();
  };

  const handleSwitchToSignIn = () => {
    onClose();
    setTimeout(() => {
      openSignIn?.();
    }, 100);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" aria-label="Close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h3 className="modal-title">Sign up</h3>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="label">Enter your name</label>
          <input className="input-pill" name="fullname" placeholder="Enter Your name" />

          <div className="hint-text">We'll call or text you to confirm your number. Standard message and data rates apply.</div>

          <div className="row-two">
            <div className="country-field">
              <label className="label small">Country</label>
              <div className="country-select">
                <select className="select-pill">
                  <option>UAE (+971)</option>
                  <option>PH (+63)</option>
                  <option>US (+1)</option>
                </select>
                <button className="chev" aria-hidden>▾</button>
              </div>
            </div>

            <div className="phone-field">
              <label className="label small">Phone Number</label>
              <input className="input-pill" placeholder="Enter Your Number" />
            </div>
          </div>

          <div className="alt-link-row" style={{ justifyContent: "flex-end" }}>
            <a className="small-link" href="#email" onClick={(e) => e.preventDefault()}>or sign up with email</a>
          </div>

          <label className="label">Password</label>
          <input className="input-pill" name="password" type="password" placeholder="Enter Your Password" />

          <button type="submit" className="btn-continue">Continue</button>
        </form>

        <hr className="divider" />

        <div className="social-title">Or Sign Up With</div>

        <div className="social-row">
          <button className="social-btn" onClick={(e) => e.preventDefault()}>
            <span className="social-icon">f</span>
            <span>Facebook</span>
          </button>

          <button className="social-btn" onClick={(e) => e.preventDefault()}>
            <span className="social-icon">G</span>
            <span>Google</span>
          </button>
        </div>

        <div className="switch-row">
          <p>
            Already have an account?{" "}
            <button className="link-button" onClick={(e) => { e.preventDefault(); handleSwitchToSignIn(); }}>
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
