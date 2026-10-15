import React from "react";
import "./Footer.css";
import logo from "../../assets/logo.png";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFax,
  FaEnvelope,
  FaGlobe,
  FaFacebookMessenger,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <section id="footer">
      <div className="container footer">
        <div className="footer-box">
          <h4>קישורים מומלצים</h4>
          <div className="footer-links">
            <a href="#">&bull; התקשרו עשיו</a>
            <a href="#">&bull; קצת עלינו</a>
            <a href="#">&bull; רשתות חברתיות</a>
            <a href="#">&bull; שלחו הודעה</a>
          </div>
        </div>
        <div className="footer-box">
          <h4>צרו קשר</h4>
          <div className="footer-contact u-text-small">
            <p>
              <FaPhoneAlt /> &nbsp; 0507562842.
            </p>
            <p>
              <FaFacebookMessenger /> &nbsp; הודעה בפייסבוק
            </p>
            <p>
              <FaWhatsapp /> &nbsp; הודעה בוואטספ
            </p>
          </div>
        </div>
        <div className="footer-box">
          <img src={logo} alt="logo" />
          <p className="u-text-small">&copy; Copyright 2021. SocialX.com</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
