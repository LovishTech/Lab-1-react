import { useState } from "react";
import axios from "axios";

function NewThreadForm({ onThreadAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Animation state for form entrance
  const [isVisible, setIsVisible] = useState(false);
  
  // Set visible after component mounts for animation
  useState(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!title.trim() || !content.trim()) {
      setError("Please fill out all fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await axios.post("http://localhost:5000/api/threads", {
        title,
        content,
        author: "User" // Replace with actual user name when auth is implemented
      });
      
      setTitle("");
      setContent("");
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
      if (onThreadAdded) onThreadAdded();
    } catch (err) {
      console.error(err);
      setError("Failed to create thread. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`new-thread-form ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="form-header">
        <h3>Start a New Discussion</h3>
        <div className="form-decoration"></div>
      </div>
      
      {error && (
        <div className="form-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="form-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Thread posted successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="animated-form">
        <div className="form-group">
          <label htmlFor="thread-title" className="form-label">Title</label>
          <input
            id="thread-title"
            type="text"
            className="form-control focus-animation"
            placeholder="What's your discussion about?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="thread-content" className="form-label">Content</label>
          <textarea
            id="thread-content"
            className="form-control focus-animation"
            placeholder="Share your thoughts..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={5}
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary btn-animated"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="button-spinner"></span>
              Posting...
            </>
          ) : (
            "Post Discussion"
          )}
        </button>
      </form>
    </div>
  );
}

export default NewThreadForm;