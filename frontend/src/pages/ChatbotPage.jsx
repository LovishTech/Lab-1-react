import { useState, useEffect, useRef } from "react";
import KommunicateChat from "../KommunicateChat";

function ChatbotPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, aiLoading]);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAiLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });
      const data = await res.json();
      const botMessage = {
        id: messages.length + 2,
        text: data.reply || "Sorry, I couldn't find an answer.",
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Sorry, there was a problem contacting the AI.",
          isBot: true,
        },
      ]);
    }
    setAiLoading(false);
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
                {/* ...avatar SVG... */}
              </div>
              <div>
                <h3>ProDiscuss Assistant</h3>
                <span className="chatbot-status online">Online</span>
              </div>
            </div>
            <button className="chatbot-clear-btn" onClick={handleClearChat} title="Clear chat">
              {/* ...clear SVG... */}
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
                    className={`chatbot-message ${message.isBot ? "bot" : "user"}`}
                  >
                    {message.isBot && (
                      <div className="bot-avatar">
                        {/* ...bot avatar SVG... */}
                      </div>
                    )}
                    <div className="message-bubble">{message.text}</div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="chatbot-message bot">
                    <div className="bot-avatar">{/* ...bot avatar SVG... */}</div>
                    <div className="message-bubble">Thinking...</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={isLoading || aiLoading}
            />
            <button type="submit" disabled={isLoading || aiLoading || !inputValue.trim()}>
              {/* ...send SVG... */}
            </button>
          </form>
        </div>
        <div className="chatbot-info-card">
          <h3>About ProDiscuss AI Assistant</h3>
          <p>
            Our AI assistant is powered by OpenAI and can answer any question about the forum or general topics.
          </p>
          <h4>What you can ask:</h4>
          <ul>
            <li>Forum topics and navigation</li>
            <li>Account and sign up help</li>
            <li>General knowledge and more!</li>
          </ul>
          <div className="chatbot-note">
            {/* ...info SVG... */}
            <p>
              For complex issues, please contact our support team through the help center.
            </p>
          </div>
        </div>
      </div>
      {/* KommunicateChat hidden */}
      <div style={{ display: "none" }}>
        <KommunicateChat fullPage={false} />
      </div>
    </div>
  );
}

export default ChatbotPage;
