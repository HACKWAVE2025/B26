import React from "react";
import "./About_Contact.css";

const Contact = () => {
  return (
    <div className="page-wrapper">
      <h1>Contact Us</h1>
      <p>Have questions or need support? We're here to help.</p>

      <div className="contact-box">
        <p>
          <strong>Email:</strong> support@agentog.ai
        </p>
        <p>
          <strong>Twitter / X:</strong> @AgentOG
        </p>
        <p>
          <strong>Community:</strong> Discord (Coming Soon)
        </p>
      </div>
    </div>
  );
};

export default Contact;
