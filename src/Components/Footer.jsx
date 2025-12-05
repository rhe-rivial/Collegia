import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
  
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
            <li><a href="https://cit.edu/blogs/">Blogs</a></li>
          </ul>
        </div>

        {/* Help Center */}
        <div className="footer-section">
          <h3 className="section-title">HELP CENTER</h3>
          <ul className="footer-links">
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="section-title">CONTACT INFO</h3>
          <div className="contact-info">
            <p>Phone: 1234567890</p>
            <p>Email: collegia@email.com</p>
            <p>Location: Eyy Philippines</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;