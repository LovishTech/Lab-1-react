import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ThreadsList({ refresh }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/threads")
      .then(res => {
        setThreads(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load threads. Please try again later.");
        setLoading(false);
      });
  }, [refresh]);

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleThreadClick = (threadId) => {
    if (selectedThread === threadId) {
      setSelectedThread(null);
    } else {
      setSelectedThread(threadId);
    }
  };

  if (loading) {
    return (
      <div className="threads-loading">
        <div className="loading-spinner pulse"></div>
        <p>Loading discussions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="threads-error">
        <div className="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <p>{error}</p>
        <button className="btn btn-secondary btn-animated" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="threads-empty card fade-in">
        <div className="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3>No discussions yet</h3>
        <p>Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="threads-container fade-in">
      <div className="threads-header">
        <h2>Recent Discussions</h2>
        <div className="header-decoration"></div>
      </div>
      
      <div className="threads-list">
        <AnimatePresence>
          {threads.map((thread, index) => (
            <motion.div 
              key={thread.id} 
              className={`thread-item ${selectedThread === thread.id ? 'expanded' : ''}`}
              onClick={() => handleThreadClick(thread.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="thread-header">
                <h3 className="thread-title">{thread.title}</h3>
                <div className="thread-meta">
                  <span className="thread-author">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {thread.author || "Anonymous"}
                  </span>
                  <span className="thread-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {formatDate(thread.createdAt || new Date())}
                  </span>
                  <span className="thread-replies">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {thread.replyCount || 0} replies
                  </span>
                </div>
              </div>
              
              <p className="thread-content">{thread.content}</p>
              
              <div className="thread-actions">
                <button className="btn btn-secondary btn-animated">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Reply
                </button>
                <button className="btn btn-outline btn-animated">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ThreadsList;