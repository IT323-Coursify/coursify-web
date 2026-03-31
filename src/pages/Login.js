import { Link } from "react-router-dom";
import logoText from "../assets/logo-text.png";
import coursifyLogo from "../assets/coursify-logo.png";
import "../styles/Login.css";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const {
    email, setEmail,
    password, setPassword,
    message,
    showPassword, setShowPassword,
    handleSubmit,
  } = useAuth();

  return (
    <main className="split-page">

      {/* LEFT SIDE */}
      <section className="split-left">
        <div className="logo-container">
          <img src={logoText} alt="Coursify logo" className="logo-text" />
        </div>
        <div className="brand-content">
          <h1>Know yourself. Find your path.</h1>
          <p>Get personalized college course recommendations based on your strengths, interests, and potential!</p>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="split-right">
        <div className="form-container">
          <div className="form-logo-container">
            <img src={coursifyLogo} alt="Coursify icon" className="form-logo" />
          </div>

          <h2>Welcome to Coursify!</h2>
          <p>Sign in to continue using Coursify.</p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>

            {/* Email Field */}
            <div className="input-box">
              <span className="input-icon-left" aria-hidden="true">
                {/* Envelope icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="box-input"
              />
            </div>

            {/* Password Field */}
            <div className="input-box">
              <span className="input-icon-left" aria-hidden="true">
                {/* Padlock icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="box-input"
              />
              {/* Eye toggle icon on right */}
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye-off */
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye */
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button type="submit" className="primary-btn">LOGIN</button>

          </form>

          {message && (
            <p className="message" role="alert">{message}</p>
          )}

          <p className="signup-link">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "#20AFAB", fontWeight: "600", textDecoration: "none" }}
            >
              Register Here
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}

export default Login;