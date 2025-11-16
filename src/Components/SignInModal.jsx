import React, { useEffect } from "react";
import "../styles/SignInModal.css";

export default function SignInModal({ onClose, setIsLoggedIn, openSignUp }) {

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ✔ When pressing Continue
  const handleSubmit = (e) => {
    e.preventDefault();

    // SUCCESS LOGIN
    setIsLoggedIn?.(true);
    alert("Login Successfully!");
    onClose();
  };

  // ✔ When clicking “Sign up here”
  const handleSwitchToSignUp = () => {
    onClose();          // close sign in modal
    setTimeout(() => {
      openSignUp?.();   // open sign up modal
    }, 200);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" aria-label="Close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h3 className="modal-title">Sign in</h3>
        </div>

        {/* FORM */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="label">Enter your name</label>
          <input className="input-pill" name="username" placeholder="Enter Your name" />

          <label className="label">Password</label>
          <input className="input-pill" name="password" type="password" placeholder="Enter Your Password" />

          <button type="submit" className="btn-continue">Continue</button>
        </form>

        <hr className="divider" />

        

        {/* SWITCH TO SIGN UP */}
        <div className="switch-row">
          <p>
            Don't have an account?{" "}
            <button
              className="link-button"
              onClick={(e) => {
                e.preventDefault();
                handleSwitchToSignUp();
              }}
            >
              Sign up here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
