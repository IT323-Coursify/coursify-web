import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import logoText from "../assets/logo-text.png";
import coursifyLogo from "../assets/coursify-logo.png";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function AdminOTPVerify() {
  const navigate  = useNavigate();
  const email     = sessionStorage.getItem("otp_email");

  const [digits, setDigits]         = useState(Array(OTP_LENGTH).fill(""));
  const [message, setMessage]       = useState("");
  const [isError, setIsError]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown]     = useState(0);

  const inputRefs = useRef([]);

  // If someone lands here without going through login, bounce them away
  useEffect(() => {
    if (!email) navigate("/login", { replace: true });
  }, [email, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ── OTP input handling ───────────────────────────────────────────────────

  const handleDigitChange = (index, value) => {
    // Accept only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next  = [...digits];
    next[index] = digit;
    setDigits(next);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && index > 0)              inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    // Focus the next empty slot or last slot
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  // ── Submit OTP ───────────────────────────────────────────────────────────

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage(""); setIsError(false);

    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setIsError(true);
      setMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/auth/admin-verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Verification failed.");
      }

      // Success — store credentials exactly like the normal login flow
      localStorage.setItem("token",         data.token);
      localStorage.setItem("user",          JSON.stringify(data.user));
      localStorage.setItem("coursify_user", JSON.stringify(data.user));
      localStorage.setItem("coursify_role", data.user?.role);
      sessionStorage.removeItem("otp_email");

      const role = data.user?.role;
      if (role === "superadmin") navigate("/superadmin/dashboard", { replace: true });
      else                       navigate("/admin/dashboard",      { replace: true });

    } catch (err) {
      setIsError(true);
      setMessage(err.message);
      // Clear digits on wrong code so user can re-enter cleanly
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;
    setMessage(""); setIsError(false);

    try {
      setResendLoading(true);
      const res  = await fetch(`${API}/api/auth/admin-resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Failed to resend OTP.");

      setIsError(false);
      setMessage("A new OTP has been sent to your email.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const allFilled = digits.every((d) => d !== "");

  return (
    <main className="split-page">
      {/* LEFT — same brand panel as Login */}
      <section className="split-left">
        <div className="logo-container">
          <img src={logoText} alt="Coursify logo" className="logo-text" />
        </div>
        <div className="brand-content">
          <h1>Secure Admin Access</h1>
          <p>A one-time password has been sent to your registered email to verify your identity.</p>
        </div>
      </section>

      {/* RIGHT — OTP form */}
      <section className="split-right">
        <div className="form-container">
          <div className="form-logo-container">
            <img src={coursifyLogo} alt="Coursify icon" className="form-logo" />
          </div>

          <h2>Admin Verification</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
            Enter the 6-digit OTP sent to
          </p>
          <p style={{
            color: "#1e293b",
            fontWeight: "700",
            fontSize: "14px",
            marginBottom: "28px",
            wordBreak: "break-all",
          }}>
            {email}
          </p>

          <form onSubmit={handleVerify} noValidate>
            {/* OTP digit boxes */}
            <div style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "24px",
            }}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  disabled={loading}
                  style={{
                    width:         "48px",
                    height:        "56px",
                    textAlign:     "center",
                    fontSize:      "22px",
                    fontWeight:    "700",
                    color:         "#1e293b",
                    border:        `2px solid ${digit ? "#20AFAB" : "#e2e8f0"}`,
                    borderRadius:  "12px",
                    outline:       "none",
                    background:    digit ? "#f0fdfb" : "#f8fafc",
                    transition:    "border-color 0.2s, background 0.2s",
                    caretColor:    "transparent",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#20AFAB";
                    e.target.style.boxShadow   = "0 0 0 3px rgba(32,175,171,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = digit ? "#20AFAB" : "#e2e8f0";
                    e.target.style.boxShadow   = "none";
                  }}
                />
              ))}
            </div>

            {/* Feedback message */}
            {message && (
              <p style={{
                fontSize:    "13px",
                color:       isError ? "#ef4444" : "#22c55e",
                textAlign:   "center",
                marginBottom: "12px",
              }}>
                {message}
              </p>
            )}

            {/* Verify button */}
            <button
              type="submit"
              className="primary-btn"
              disabled={loading || !allFilled}
              style={{ opacity: allFilled ? 1 : 0.5 }}
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </form>

          {/* Resend */}
          <p style={{
            textAlign:  "center",
            fontSize:   "13px",
            color:      "#64748b",
            marginTop:  "20px",
          }}>
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resendLoading}
              style={{
                background: "none",
                border:     "none",
                color:      cooldown > 0 ? "#94a3b8" : "#20AFAB",
                fontWeight: "600",
                cursor:     cooldown > 0 ? "default" : "pointer",
                fontSize:   "13px",
                padding:    0,
              }}
            >
              {resendLoading
                ? "Sending…"
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend OTP"}
            </button>
          </p>

          {/* Back to login */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("otp_email");
                navigate("/login");
              }}
              style={{
                background: "none",
                border:     "none",
                color:      "#94a3b8",
                cursor:     "pointer",
                fontSize:   "13px",
                textDecoration: "underline",
              }}
            >
              ← Back to Login
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}