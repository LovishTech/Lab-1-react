import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/">
              <svg className="logo" width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4A90E2"/>
                    <stop offset="100%" stopColor="#5C6BC0"/>
                  </linearGradient>
                </defs>
                <rect x="70" y="70" width="372" height="372" rx="40" fill="url(#footerGradient)"/>
                <circle cx="256" cy="180" r="45" fill="white"/>
                <circle cx="160" cy="300" r="35" fill="white"/>
                <circle cx="352" cy="300" r="35" fill="white"/>
                <path d="M160 300 L256 180 L352 300" stroke="white" strokeWidth="16" fill="none" strokeLinecap="round"/>
                <path d="M120 350 L392 350" stroke="white" strokeWidth="16" fill="none" strokeLinecap="round"/>
                <path d="M150 380 L362 380" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"/>
              </svg>
              <span>ProDiscuss</span>
            </Link>
            <p>Professional discussions for the modern workplace</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-section">
              <h4>Navigate</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/topics">Topics</Link></li>
                <li><Link to="/ai-chatbot">AI Chatbot</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-section">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/guidelines">Community Guidelines</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-section">
              <h4>Connect</h4>
              <ul>
                <li><a href="https://github.com/lovishbatra" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/lovish-batra-b202122a8" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://facebook.com/prodiscuss" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="mailto:lovishbatra.2004@gmail.com">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} ProDiscuss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;