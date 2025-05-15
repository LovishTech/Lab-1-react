import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignInPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      return "weak";
    }
    // You can add more rules here for stronger passwords
    if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
      return "strong";
    }
    return "medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Password must be at least 8 characters
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    // Simulate API call for authentication
    setTimeout(() => {
      if (formData.email && formData.password) {
        const userData = { email: formData.email };
        localStorage.setItem("user", JSON.stringify(userData));
        onLogin(userData);
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Sign In</h1>
            <p>Welcome back to ProDiscuss</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className={`password-strength ${passwordStrength}`}>
                Strength: 
                {passwordStrength === "weak" && <span style={{ color: "red" }}> Weak</span>}
                {passwordStrength === "medium" && <span style={{ color: "orange" }}> Medium</span>}
                {passwordStrength === "strong" && <span style={{ color: "green" }}> Strong</span>}
              </div>
            </div>
            
            <div className="form-group forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
