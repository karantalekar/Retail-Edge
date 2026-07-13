import React, { useMemo, useState } from "react";
import { FaCheck, FaEye, FaEyeSlash, FaIdBadge, FaShieldAlt, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import api from "../config/api";
import staffOnboardingImage from "../assets/staff-onboarding.png";
import "../style/AdminWorkspace.css";

const emptyForm = { fullName: "", email: "", password: "", role: "staff" };

const Registration = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = useMemo(() => [
    { label: "8+ characters", valid: formData.password.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(formData.password) },
    { label: "Lowercase", valid: /[a-z]/.test(formData.password) },
    { label: "Number", valid: /\d/.test(formData.password) },
    { label: "Symbol", valid: /[@$!%*?&#]/.test(formData.password) },
  ], [formData.password]);
  const passwordValid = passwordChecks.every((check) => check.valid);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!passwordValid) {
      toast.error("Create a password that meets every security requirement");
      return;
    }
    setLoading(true);
    try {
      await api.post("/register", {
        ...formData,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      });
      toast.success("Staff account created and ready for approval");
      setFormData(emptyForm);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to register staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <main className="container-fluid px-3 px-lg-4 admin-main">
        <header className="admin-header">
          <div><span>TEAM ONBOARDING</span><h1>Register staff</h1><p>Create secure access for a new member of your retail team.</p></div>
        </header>

        <section className="admin-panel staff-registration-card">
          <div className="registration-form-panel">
            <div className="admin-panel-heading"><div><h2>Staff information</h2><p>All fields are required.</p></div><span className="admin-heading-icon"><FaUserPlus /></span></div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <label><span>Full name</span><input className="form-control" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Aisha Sharma" autoComplete="name" required /></label>
              <label><span>Work email</span><input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="aisha@company.com" autoComplete="email" required /></label>
              <label><span>Account role</span><div className="role-card selected"><FaIdBadge /><div><strong>Store staff</strong><small>Billing and daily sales access</small></div><span><FaCheck /></span></div><input type="hidden" name="role" value="staff" /></label>
              <label><span>Temporary password</span><div className="admin-password-input"><input className="form-control" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create a secure password" autoComplete="new-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div></label>
              <div className="password-checks">{passwordChecks.map((check) => <span key={check.label} className={check.valid ? "valid" : ""}><FaCheck /> {check.label}</span>)}</div>
              <button className="btn btn-primary admin-primary-action" disabled={loading || !passwordValid}>{loading ? "Creating account…" : <><FaUserPlus /> Create staff account</>}</button>
            </form>
          </div>

          <aside className="registration-visual-panel">
            <div className="registration-image-wrap">
              <img src={staffOnboardingImage} alt="Retail team welcoming a new staff member" />
            </div>
            <div className="registration-visual-copy">
              <span className="onboarding-icon"><FaShieldAlt /></span>
              <div>
                <h2>Secure staff onboarding</h2>
                <p>New accounts stay inactive until an administrator reviews and approves access.</p>
              </div>
            </div>
            <div className="registration-benefits">
              <span><FaCheck /> Role-based workspace access</span>
              <span><FaCheck /> Administrator approval required</span>
              <span><FaCheck /> Secure password standards</span>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Registration;
