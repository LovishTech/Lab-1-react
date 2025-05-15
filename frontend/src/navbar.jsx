import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ isAuthenticated, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg className="logo" width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A90E2"/>
                <stop offset="100%" stopColor="#5C6BC0"/>
              </linearGradient>
            </defs>
            <rect x="70" y="70" width="372" height="372" rx="40" fill="url(#gradient)"/>
            <circle cx="256" cy="180" r="45" fill="white"/>
            <circle cx="160" cy="300" r="35" fill="white"/>
            <circle cx="352" cy="300" r="35" fill="white"/>
            <path d="M160 300 L256 180 L352 300" stroke="white" strokeWidth="16" fill="none" strokeLinecap="round"/>
            <path d="M120 350 L392 350" stroke="white" strokeWidth="16" fill="none" strokeLinecap="round"/>
            <path d="M150 380 L362 380" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="navbar-title">ProDiscuss</span>
        </Link>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/topics" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            Topics
          </Link>
          <Link to="/ai-chatbot" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            AI Chatbot
          </Link>
          <Link to="/about" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          
          <div className="navbar-buttons">
            {isAuthenticated ? (
              <>
                <div className="user-dropdown">
                  <button className="dropdown-toggle">
                    <div className="user-avatar">
                      {user?.fullName ? user.fullName[0] : user?.email[0]}
                    </div>
                    <span className="user-name">
                      {user?.fullName || user?.email.split('@')[0]}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <Link to="/settings" className="dropdown-item">Settings</Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;