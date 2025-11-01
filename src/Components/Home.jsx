import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import "./Home.css";
import heroImg from "./HomeImage.png";
import ProcessSteps from "./ProcessSteps";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ Hook for navigation

  // ✅ Load user safely from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("agentog_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || "",
          email: parsed.email || "",
        });
      } catch {
        setUser({ email: storedUser });
      }
    }
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("agentog_user");
    setUser(null);
  };

  // ✅ Handle Launch Agent OG button click
  const handleLaunchAgent = () => {
    if (user && user.email) {
      navigate("/dashboard"); // Logged in → go to Dashboard
    } else {
      navigate("/auth"); // Not logged in → go to Auth
    }
  };

  const features = [
    {
      icon: "📩",
      title: "Gmail Inbox Manager",
      desc: "Auto-label, draft, and schedule meetings right from your inbox.",
    },
    {
      icon: "🗓️",
      title: "Smart Calendar Management",
      desc: "Synchronize meetings and avoid double bookings with AI.",
    },
    {
      icon: "💡",
      title: "LinkedIn Post & Content Creation",
      desc: "Create engaging posts and captions with AI.",
    },
    {
      icon: "⏰",
      title: "Schedule Emails & Remainders",
      desc: "Automatic sending of emails & calls at desired time.",
    },

    {
      icon: "✅",
      title: "Task & Workflow Automation",
      desc: "Turn chats and emails into actionable tasks seamlessly.",
    },
    {
      icon: "💼",
      title: "Expense Management",
      desc: "Generate AI-based reports and manage budgets easily.",
    },
    {
      icon: "💬",
      title: "Customer Support Automation",
      desc: "Respond to client queries 24/7 using integrated AI workflows.",
    },

    {
      icon: "🖼️",
      title: "AI Image Generation",
      desc: "Design high-quality visuals in seconds for your needs.",
    },
  ];

  const tools = [
    "Gmail",
    "Calender",
    "Task",
    "Sheets",
    "Drive",
    "LinkedIn",
    "Twilio",
    "API'S",
  ];

  const testimonials = [
    {
      name: "Anil Varikala",
      text: "Agent OG feels like a real teammate — one that never forgets and always acts instantly.",
    },
    {
      name: "Sai Kiran",
      text: "Seamless across every app I use. Productivity finally works together.",
    },
    {
      name: "Nadeem",
      text: "A perfect fusion of automation and intuition — it just understands my workflow.",
    },
  ];

  return (
    <div className="home">
      {/* Navbar */}

      <nav className="navbar">
        <div className="nav-logo">Agent OG</div>
        {/* <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/workflows")}>Workflows</li>
          <li onClick={() => navigate("/integrations")}>Integrations</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
        </ul> */}
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/workflows">Workflows</Link>
          </li>
          <li>
            <Link to="/integrations">Integrations</Link>
          </li>
          <li>
            <Link to="/dashboard">Chat</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        {/* ✅ Conditionally show login or logout */}
        <div className="nav-actions">
          {user && user.email ? (
            <>
              <span className="welcome-text">
                👋 Welcome, {user.name || user.email}
              </span>
              <button className="nav-btn logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="nav-btn" onClick={() => navigate("/auth")}>
              Login / Signup →
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Integrate Everything. <br />
            Automate Anything.⚡
          </h1>
          <p>
            Agent OG unifies Gmail, Drive, Calendar, Tasks, LinkedIn and AI — giving you
            a single command center for productivity.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleLaunchAgent}>
              Launch Agent OG
            </button>
            {/* <button className="btn-secondary">See How It Works</button> */}
            <button
              className="btn-secondary"
              onClick={() => navigate("/setup-process")}
            >
              See How It Works
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Agent OG Dashboard" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>What Makes Agent OG Powerful ⚙️</h2>
        <p className="features-subtitle">
          An AI-driven productivity ecosystem built for modern professionals and
          teams.
        </p>

        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="integrations">
        <h2>Seamless Integrations 🔗</h2>
        <div className="tool-marquee">
          {tools.map((tool, i) => (
            <span key={i} className="tool">
              {tool}
            </span>
          ))}
        </div>
      </section>
      <ProcessSteps />

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Loved by Professionals Worldwide 💬</h2>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p>"{t.text}"</p>
              <h4>— {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Agent OG — Built for the Future of Productivity.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
