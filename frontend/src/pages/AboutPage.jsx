function AboutPage() {
  return (
    <div className="about-page">
      <div className="forum-header">
        <h1>About ProDiscuss</h1>
      </div>
      
      <div className="card">
        <h2>Our Mission</h2>
        <p>ProDiscuss is a professional discussion platform designed to connect individuals across various fields and interests. Our goal is to foster meaningful conversations, knowledge sharing, and community building in a modern, user-friendly environment.</p>
        
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h3>Interactive Discussions</h3>
            <p>Engage in rich, threaded conversations with advanced formatting tools.</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                <path d="M10 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                <path d="M17 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                <path d="M8 13h8a4 4 0 1 1-8 0z"></path>
              </svg>
            </div>
            <h3>AI Assistant</h3>
            <p>Get support from our intelligent chatbot that's always ready to help.</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Community Focus</h3>
            <p>Connect with professionals and enthusiasts across various fields.</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3>Responsive Design</h3>
            <p>Enjoy a seamless experience across all your devices.</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>Contact Us</h2>
        <p>Have questions or suggestions? We'd love to hear from you!</p>
        <a href="mailto:lovishbatra.2004@gmail.com" className="btn btn-primary">Email Us</a>
      </div>
    </div>
  );
}

export default AboutPage;