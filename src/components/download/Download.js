import React, { useEffect } from "react";
import "./Download.css";
import { FaApple, FaFacebook, FaPhone, FaWhatsapp, FaWindows } from "react-icons/fa";
import { GrAndroid, GrInstagram } from "react-icons/gr";
import { IconContext } from "react-icons";
import AOS from "aos";
import "aos/dist/aos.css";

const Download = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id="download">
      <div className="container download" data-aos="fade-up">
        <h2>צרו קשר</h2>
        <p className="u-text-small">
          
        </p>
        <IconContext.Provider value={{ size: "15" }}>
          <div className="download-icons">
            <div className="download-icon">
              <FaPhone /> <p>טלפון</p>
            </div>
            <div className="download-icon">
              <FaWhatsapp /> <p>וואטספ</p>
            </div>
          </div>
        </IconContext.Provider>
      </div>
    </section>
  );
};

export default Download;
