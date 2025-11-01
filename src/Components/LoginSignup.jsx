import React, { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    webhookUrl: "",
  });

  const toggleForm = () => setIsSignup(!isSignup);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const url = isSignup
    ? "http://localhost:5000/api/auth/signup"
    : "http://localhost:5000/api/auth/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Something went wrong!");
      return;
    }

    // ✅ Save user and token to localStorage
    localStorage.setItem("agentog_token", data.token);
    localStorage.setItem("agentog_user", JSON.stringify(data.user));

    alert(isSignup ? "Signup successful 🎉" : "Login successful ✅");

    // ✅ Redirect to dashboard
    window.location.href = "/";
  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Please try again later.");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Agent OG</h1>

        <h2 className="auth-heading">
          {isSignup ? "Create Your Account" : "Welcome Back"}
        </h2>

        <p className="auth-subtext">
          {isSignup
            ? "Join the productivity revolution with Agent OG ⚡"
            : "Login to continue your smart workflows"}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isSignup && (
            <>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="auth-input"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                type="text"
                name="webhookUrl"
                placeholder="Webhook URL"
                className="auth-input"
                value={formData.webhookUrl}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span onClick={toggleForm}>
            {isSignup ? "Login here" : "Sign up here"}
          </span>
        </p>
      </div>

      <div className="auth-bg">
        <div className="auth-overlay"></div>
      </div>
    </div>
  );
};

export default LoginSignup;
