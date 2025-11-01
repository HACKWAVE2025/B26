
import React from 'react'

const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo">Agent OG</div>
        
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

    </div>
  )
}

export default Navbar

