import { useState } from "react";
import { Link } from "react-router-dom"; 
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import logoText from "../assets/logo-text.png";
import coursifyLogo from "../assets/coursify-logo.png";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const users = [
    {
      email: "student1@coursify.com",
      password: "123456",
      name: "User 1",
    },

  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }
    // Find user in the array
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      setMessage(`Welcome, ${foundUser.name}! Login successful.`);
      navigate("/dashboard");
    } else {
      setMessage("Invalid email or password.");
    }
  };

  return (
    <main className="split-page">

      {/* LEFT SIDE */}
      <div className="split-left">

        {/* Logo at top-left */}
        <div className="logo-container">
          <img src={logoText} alt="Coursify" className="logo-text" />
        </div>

        <div className="brand-content">
          <h1>Know yourself. Find your path. </h1>
          <p>Get personalized college course recommendations based on your strengths, interests, and potential!</p>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="split-right">
        <div className="form-container">
          {/* Logo centered */}
          <div className="form-logo-container">
            <img src={coursifyLogo} alt="Coursify Logo" className="form-logo" />
          </div>

          <h2>Welcome to Coursify!</h2>
          <p>Sign in to continue using Coursify.</p>
          <form onSubmit={handleSubmit} className="login-form">

            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Username"
            />

            <InputField
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {/* Interactive Behavior 1: Toggle Password */}
            <div className="remember-row">
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span>Show password</span>
              </div>

              <span className="forgot-link">Forgot password?</span>
            </div>

            <PrimaryButton text="LOGIN" type="submit" />

          </form>

          {message && <p className="message">{message}</p>}

          <p className="signup-link">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: '#20AFAB', fontWeight: '600', textDecoration: 'none' }}>
              Register Here
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Login;