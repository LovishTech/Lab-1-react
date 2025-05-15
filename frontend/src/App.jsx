import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./navbar";
import HomePage from "./pages/HomePage";
import ChatbotPage from "./pages/ChatbotPage";
import TopicsPage from "./pages/TopicsPage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Footer from "./footer";
import "./App.css";
import "./auth-chatbot.css"; // Import the new CSS file4
import "./HomePage.css";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleThreadAdded = () => setRefresh(r => !r);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout} 
        />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    refresh={refresh} 
                    onThreadAdded={handleThreadAdded}
                    isAuthenticated={isAuthenticated} 
                  />
                } 
              />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/ai-chatbot" element={<ChatbotPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route 
                path="/signin" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <SignInPage onLogin={handleLogin} />
                  )
                } 
              />
              <Route 
                path="/signup" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <SignUpPage onLogin={handleLogin} />
                  )
                } 
              />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;