import { useState } from "react";
import "./Login.css";
import logo from "./assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const user = {
    email: "admin@smartcourse.com",
    password: "123456",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === user.email && password === user.password) {
      setMessage("Login successful! Welcome to Coursify.");
    } else {
      setMessage("Invalid email or password.");
    }
  };

  return (
  <main className="page">
        {/* PAGE HEADER */}
        <header className="page-header">
            <img src={logo} alt="Coursify Logo" className="page-logo" />
        </header>

        {/* LOGIN CARD */}
        <section className="login-wrapper">
            {/* LEFT SIDE */}
            <div className="login-left">
                <h1>LOGIN</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="yourname@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">LOGIN</button>

                    <p className="signup-link">
                    Don&apos;t have an account? <a href="/register">Click here</a>
                    </p>

                </form>

                {message && <p className="message">{message}</p>}
            </div>

            {/* RIGHT SIDE */}
            <div className="login-right">
                <div className="wave"></div>
            </div>
        </section>
  </main>
);

}

export default Login;
