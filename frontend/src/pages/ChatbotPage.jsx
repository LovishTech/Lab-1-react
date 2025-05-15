import { useState, useEffect, useRef } from "react";
import KommunicateChat from "../KommunicateChat";

function ChatbotPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);
  
  // Simulate chatbot loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    };
    
    setMessages([...messages, userMessage]);
    setInputValue("");
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse;
      
      if (inputValue.toLowerCase().includes("hello") || inputValue.toLowerCase().includes("hi")) {
        botResponse = "Hello there! How can I assist you with ProDiscuss today?";
      } else if (inputValue.toLowerCase().includes("topic") || inputValue.toLowerCase().includes("forum")) {
        botResponse = "Our forum has various topics including technology, science, art, and more. You can browse them in the Topics section!";
      } else if (inputValue.toLowerCase().includes("account") || inputValue.toLowerCase().includes("sign")) {
        botResponse = "You can create an account by clicking the Sign Up button in the navigation bar. If you already have an account, you can sign in.";
      } else {
        botResponse = "I'm here to help with any questions about our forum. Feel free to ask about topics, posting, or account features!";
      }
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 800);
  };
  
  const handleClearChat = () => {
    setMessages([
      { id: 1, text: "Hello! How can I help you today?", isBot: true },
    ]);
  };

  return (
    <div className="chatbot-page">
      <div className="forum-header">
        <h1>AI Chatbot Assistant</h1>
        <p className="subtitle">Get instant help and answers from our AI assistant</p>
      </div>
      
      <div className="chatbot-container">
        <div className="chatbot-card">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                </svg>
              </div>
              <div>
                <h3>ProDiscuss Assistant</h3>
                <span className="chatbot-status online">Online</span>
              </div>
            </div>
            <button className="chatbot-clear-btn" onClick={handleClearChat} title="Clear chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
          
          <div className="chatbot-body" ref={chatContainerRef}>
            {isLoading ? (
              <div className="chatbot-loading">
                <div className="loading-spinner"></div>
                <p>Initializing AI assistant...</p>
              </div>
            ) : (
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`chatbot-message ${message.isBot ? 'bot' : 'user'}`}
                  >
                    {message.isBot && (
                      <div className="bot-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="10" r="3"></circle>
                          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                        </svg>
                      </div>
                    )}
                    <div className="message-bubble">
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
        
        <div className="chatbot-info-card">
          <h3>About ProDiscuss AI Assistant</h3>
          <p>Our AI assistant is designed to help you navigate the forum, answer common questions, and provide assistance with your discussions.</p>
          
          <h4>What you can ask:</h4>
          <ul>
            <li>Questions about forum topics</li>
            <li>How to create or manage your account</li>
            <li>Forum guidelines and rules</li>
            <li>Technical support for basic issues</li>
          </ul>
          
          <div className="chatbot-note">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>For complex issues, please contact our support team through the help center.</p>
          </div>
        </div>
      </div>
      
      {/* Add the original KommunicateChat as a hidden element */}
      <div style={{ display: 'none' }}>
        <KommunicateChat fullPage={false} />
      </div>
    </div>
  );
}

export default ChatbotPage;