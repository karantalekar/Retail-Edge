import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import api from "../config/api";
import "../style/AdminRegister.css";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    adminKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (!password) return 0;
    return [
      password.length >= 8,
      /[A-Z]/.test(password) && /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const validateForm = () => {
    const { fullName, email, password, adminKey } = formData;
    if (!fullName || !email || !password || !adminKey) {
      setError("All fields are required");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await api.post("/admin/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        adminKey: formData.adminKey,
      });

      setMessage(res.data.message || "Admin registered successfully");
      const token = res.data.token;
      const user = res.data.user;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setFormData({ fullName: "", email: "", password: "", adminKey: "" });
        setTimeout(() => navigate("/Analytics"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][
    passwordStrength
  ];

  return (
    <main className="admin-register-page">
      <div className="admin-register-glow admin-register-glow--one" />
      <div className="admin-register-glow admin-register-glow--two" />

      <section
        className="admin-register-shell"
        aria-labelledby="register-title"
      >
        <aside className="admin-register-intro">
          <div className="admin-brand">
            <span className="admin-brand__mark">
              <ShieldCheck size={22} />
            </span>
            <span>RetailEdge</span>
          </div>

          <div className="admin-intro-copy">
            <span className="admin-eyebrow">Secure workspace access</span>
            <h1>Lead your retail operations with clarity.</h1>
            <p>
              Create a protected administrator profile to manage teams,
              inventory, and performance from one place.
            </p>
          </div>

          <div className="admin-trust-card">
            <LockKeyhole size={20} />
            <div>
              <strong>Admin-only onboarding</strong>
              <span>
                Your access key verifies that you are authorized to join.
              </span>
            </div>
          </div>
        </aside>

        <div className="admin-register-form-panel">
          <div className="admin-form-heading">
            <span className="admin-mobile-brand">
              <ShieldCheck size={18} /> RetailEdge
            </span>
            <h2 id="register-title">Create admin account</h2>
            <p>Enter your details to set up secure access.</p>
          </div>

          {error && (
            <div className="admin-alert admin-alert--error" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="admin-alert admin-alert--success" role="status">
              <CheckCircle2 size={18} />
              {message}
            </div>
          )}

          <form className="admin-form" onSubmit={handleSubmit} noValidate>
            <div className="admin-field">
              <label htmlFor="admin-full-name">Full name</label>
              <div className="admin-input-wrap">
                <UserRound size={18} />
                <input
                  id="admin-full-name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Karan Talekar"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="admin-email">Work email</label>
              <div className="admin-input-wrap">
                <Mail size={18} />
                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="admin-visibility"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div
                  className="admin-strength"
                  data-strength={passwordStrength}
                >
                  <div className="admin-strength__bars">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={level <= passwordStrength ? "is-active" : ""}
                      />
                    ))}
                  </div>
                  <span>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="admin-field">
              <div className="admin-label-row">
                <label htmlFor="admin-key">Admin access key</label>
                <span>Provided by your organization</span>
              </div>
              <div className="admin-input-wrap">
                <KeyRound size={18} />
                <input
                  id="admin-key"
                  type={showAdminKey ? "text" : "password"}
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={handleChange}
                  placeholder="Enter secure key"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="admin-visibility"
                  onClick={() => setShowAdminKey((value) => !value)}
                  aria-label={
                    showAdminKey ? "Hide admin key" : "Show admin key"
                  }
                >
                  {showAdminKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="admin-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="admin-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="admin-login-link">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </p>
          <p className="admin-legal">
            By creating an account, you agree to your organization&apos;s access
            and security policies.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AdminRegister;
