import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import logoText from "../assets/logo-text.png";
import coursifyLogo from "../assets/coursify-logo.png";
import "../styles/Login.css"; 
import "../styles/Register.css"; 

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }


    setMessage("Registration successful! Redirecting to login...");
    
   
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <main className="split-page">
    
      <div className="split-left">
        <div className="logo-container">
          <img src={logoText} alt="Coursify" className="logo-text" />
        </div>

        <div className="brand-content">
          <h1>Know yourself. Find your path.</h1>
          <p>Get personalized college course recommendations based on your strengths, interests, and potential!</p>
        </div>
      </div>

    
      <div className="split-right">
        <div className="form-container register-form-container">
         
          <div className="form-logo-container">
            <img src={coursifyLogo} alt="Coursify Logo" className="form-logo" />
          </div>

          <h2>Create Account</h2>
          <p>Join Coursify and start your journey!</p>
          
          <form onSubmit={handleSubmit} className="login-form register-form">
            {/* Full Name Field */}
            <InputField
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
            />

            {/* Email Field */}
            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />

            {/* Password Field */}
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {/* Confirm Password Field */}
            <InputField
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />

            <PrimaryButton text="REGISTER" type="submit" />
          </form>

          {message && <p className={`message ${message.includes("successful") ? "success-message" : ""}`}>{message}</p>}

          <p className="signup-link">
            Already have an account? <span onClick={handleLoginClick}>Login Here</span>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;