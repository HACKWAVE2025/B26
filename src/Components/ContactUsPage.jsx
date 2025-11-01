import React, { useState } from "react";
import "./About_Contact.css";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseText, setResponseText] = useState(null);
  const [statusMessage, setStatusMessage] = useState(""); // For real-time status

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseText(null);
    setStatusMessage("Waiting for response from server...");

    try {
      const payload = {
        messageType: "contact",
        ...formData,
      };

      const res = await fetch(
        "http://localhost:5678/webhook-test/b880b21f-ce14-4b48-8c5f-c5e573889c61",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`Webhook error: ${res.status}`);

      // Try parsing as JSON first; fallback to plain text if not valid JSON
      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        data = [{ text }];
      }

      // ✅ Wait until webhook fully responds and display the exact message
      const reply =
        data[0]?.output ||
        data.output ||
        "✅ Message received successfully! We'll get back to you soon.";

      setResponseText(reply);
      setStatusMessage(""); // Clear waiting status

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending form:", error);
      setResponseText(`❌ Error: ${error.message}`);
      setStatusMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-page">
      <div className="contact-us-container">
        <div className="contact-us-card">
          <h2>Contact Our Support Team</h2>
          <p className="contact-description">
            Have questions, feedback, or need assistance? Reach out to us using
            the form below.
          </p>

          {responseText ? (
            <div className="submission-success">
              <p>{responseText}</p>
              <button
                onClick={() => setResponseText(null)}
                className="back-to-form-btn"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is your message about?"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  rows="6"
                  required
                ></textarea>
              </div>

              {statusMessage && (
                <p className="waiting-message">{statusMessage}</p>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
