import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>Future Events</h3>
            <p>Stay Up to Date</p>
          </div>
          <div className="newsletter-form">
            <input type="email" className='email-input' placeholder='Your Email.. '></input>
           
            <button className="subscribe-btn">
              <div className="arrow-icon">
                <div className="arrow-shape"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="logo-container">
            <img src="/icons/logo.png" alt="Collegia Logo" />
            <h1 className="brand-name">Collegia</h1>
          </div>
          <p className="brand-description">
            Collegia allows students, faculty, and organizers to book venues for org, campus, or networking events in Cebu Institute of Technology-University.
          </p>
        </div>

        {/* Company Links */}
        <div className="footer-section">
          <h3 className="section-title">COMPANY</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/legal">Legal Information</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/blog">Blogs</a></li>
          </ul>
        </div>

        {/* Help Center */}
        <div className="footer-section">
          <h3 className="section-title">HELP CENTER</h3>
          <ul className="footer-links">
            <li><a href="/find-property">Find a Property</a></li>
            <li><a href="/how-to-host">How To Host?</a></li>
            <li><a href="/why-us">Why Us?</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="section-title">CONTACT INFO</h3>
          <div className="contact-info">
            <p>Phone: 1234567890</p>
            <p>Email: company@email.com</p>
            <p>Location: 100 Smart Street, LA, USA</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;