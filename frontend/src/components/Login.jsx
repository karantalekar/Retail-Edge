import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";
import api from "../config/api";
import "../style/Auth.css";

const Login = () => {
  const [theme] = useState(
    () => localStorage.getItem("retailEdgeDashboardTheme") || "light",
  );
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post("/login", {
        email: formData.email.trim(),
        password: formData.password,
      });
      const { user, token } = response.data;
      if (!user || !token) throw new Error("No session data received");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(response.data.message || "Welcome back");
      navigate(user.role?.toLowerCase() === "admin" ? "/Analytics" : "/Cart");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  const openRecovery = () => {
    setRecoveryEmail(formData.email);
    setRecoverySent(false);
    setRecoveryOpen(true);
  };

  const submitRecovery = async (event) => {
    event.preventDefault();
    setRecoveryLoading(true);
    try {
      await api.post("/forgot-password", { email: recoveryEmail.trim() });
      setRecoverySent(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to request password help",
      );
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <main className={`auth-page ${theme === "dark" ? "auth-dark" : "auth-light"}`}>
      <section className="auth-brand-panel">
        <button className="auth-back" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to home
        </button>
        <div className="auth-brand-content">
          <div className="auth-brand-mark">
            <img src="/logo.svg" alt="RetailEdge" />
          </div>
          <span>RETAILEDGE</span>
          <h1>Run your retail operation with clarity.</h1>
          <p>
            Inventory, billing, staff, and sales intelligence—all in one secure
            workspace.
          </p>
          <div className="auth-trust">
            <FaShieldAlt />
            <div>
              <strong>Protected workspace</strong>
              <small>Role-based access for admins and staff</small>
            </div>
          </div>
        </div>
        <small className="auth-copyright">
          RetailEdge · Smarter retail operations
        </small>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <img src="/logo.svg" alt="RetailEdge" /> RetailEdge
          </div>
          <span className="auth-eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="auth-intro">
            Enter your RetailEdge credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              <span>Email address</span>
              <div className="auth-input">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>
            <label>
              <div className="auth-label-row">
                <span>Password</span>
                <button type="button" onClick={openRecovery}>
                  Forgot password?
                </button>
              </div>
              <div className="auth-input">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <button
              className="btn btn-primary auth-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" /> Signing
                  in…
                </>
              ) : (
                "Sign in securely"
              )}
            </button>
          </form>
          <p className="auth-help">
            Staff access must be approved by an administrator.
          </p>
          {/* <div className="auth-vite-badge" title="Built with Vite">
            <img src="/vite.svg" alt="Vite" />
            <span>Powered by Vite</span>
          </div> */}
        </div>
      </section>

      {recoveryOpen && (
        <div
          className="auth-modal-backdrop"
          onMouseDown={() => setRecoveryOpen(false)}
        >
          <div
            className="auth-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="auth-modal-close"
              onClick={() => setRecoveryOpen(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            {recoverySent ? (
              <div className="auth-recovery-success">
                <span>
                  <FaCheckCircle />
                </span>
                <h3>Request submitted</h3>
                <p>
                  Your administrator can now see your recovery request and
                  assign a temporary password. For security, we don’t confirm
                  whether an email is registered.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setRecoveryOpen(false)}
                >
                  Return to sign in
                </button>
              </div>
            ) : (
              <>
                <span className="auth-modal-icon">
                  <FaLock />
                </span>
                <h3>Forgot your password?</h3>
                <p>
                  Enter your work email. Your RetailEdge administrator will
                  receive a secure recovery request.
                </p>
                <form onSubmit={submitRecovery}>
                  <label>
                    <span>Work email</span>
                    <div className="auth-input">
                      <FaEnvelope />
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(event) =>
                          setRecoveryEmail(event.target.value)
                        }
                        placeholder="you@company.com"
                        required
                        autoFocus
                      />
                    </div>
                  </label>
                  <button
                    className="btn btn-primary w-100"
                    disabled={recoveryLoading}
                  >
                    {recoveryLoading ? "Submitting…" : "Request password help"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Login;
