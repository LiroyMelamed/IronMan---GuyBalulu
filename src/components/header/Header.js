import React, { useEffect } from "react";
import "./Header.css";
import Button from "../UI/Button/Button";
import "../UI/Button/Button.css";
import phoneHeader from "../../assets/phone-header-bg.png";
import { BsMouse } from "react-icons/bs";

import AOS from "aos";
import "aos/dist/aos.css";

const Header = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id="header">
      <div className="container header">
        <div className="header-left" data-aos="fade-right">
          <h1>
            <span>פינוי פסולת</span>
            <span>תיאום מהיום למחר</span>
            <span>עבודה נקייה</span>
          </h1>
          <p className="u-text-small">
            איש הברזל מציע עבודה מקצועית ונקייה.
            פינויי פסולת בניין, פינוי כל סוגי הברזל והנחושת.
            במחירים שלא תאמינו
          </p>
          <div className="header-cta">
          </div>
        </div>
        <div className="header-right" data-aos="fade-left">
          <img src={phoneHeader} alt="phone" />
        </div>
      </div>
      <div className="floating-icon">
        <a href="#features">
          <BsMouse color="#fff" size={25} className="mouse" />
        </a>
      </div>
    </section>
  );
};

export default Header;
