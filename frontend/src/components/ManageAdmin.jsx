import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheck, FaEnvelope, FaEye, FaEyeSlash, FaIdBadge, FaLock, FaSave, FaShieldAlt, FaSyncAlt, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import api from "../config/api";
import ConfirmDialog from "./ConfirmDialog";
import "../style/AdminWorkspace.css";

const ManageAdmin = () => {
  const [profile, setProfile] = useState({ fullname: "", email: "", role: "admin", id: "" });
  const [initialProfile, setInitialProfile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);

  const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
  const loadProfile = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await api.get("/me", authConfig());
      const data = response.data?.data || response.data;
      const nextProfile = { fullname: data.fullname || "", email: data.email || "", role: data.role || "admin", id: data.id || "" };
      setProfile(nextProfile);
      setInitialProfile(nextProfile);
      if (silent) toast.success("Settings refreshed");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load admin settings");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const passwordChecks = useMemo(() => [
    { label: "8+ characters", valid: newPassword.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(newPassword) },
    { label: "Lowercase", valid: /[a-z]/.test(newPassword) },
    { label: "Number", valid: /\d/.test(newPassword) },
    { label: "Symbol", valid: /[@$!%*?&#]/.test(newPassword) },
  ], [newPassword]);
  const passwordValid = passwordChecks.every((check) => check.valid);
  const profileChanged = initialProfile && (profile.fullname !== initialProfile.fullname || profile.email !== initialProfile.email);
  const securityChanged = Boolean(newPassword || confirmPassword);

  const saveProfile = async (event) => {
    event.preventDefault();
    const changingPassword = activeSection === "security";
    if (changingPassword && (!passwordValid || newPassword !== confirmPassword)) {
      toast.error(newPassword !== confirmPassword ? "Passwords do not match" : "Password does not meet the security requirements");
      return;
    }
    setSaving(true);
    try {
      const payload = changingPassword
        ? { password: newPassword }
        : { fullname: profile.fullname.trim(), email: profile.email.trim() };
      const response = await api.put("/me", payload, authConfig());
      const data = response.data?.data;
      if (data) {
        const nextProfile = { fullname: data.fullname, email: data.email, role: data.role, id: data.id };
        setProfile(nextProfile);
        setInitialProfile(nextProfile);
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...storedUser, fullname: data.fullname, email: data.email }));
      }
      setNewPassword("");
      setConfirmPassword("");
      toast.success(changingPassword ? "Password updated successfully" : "Profile saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to save settings");
    } finally { setSaving(false); }
  };

  const applySectionSwitch = (section) => {
    if (profileChanged && initialProfile) setProfile(initialProfile);
    setNewPassword("");
    setConfirmPassword("");
    setActiveSection(section);
  };

  const switchSection = (section) => {
    if (section === activeSection) return;
    if (profileChanged || securityChanged) {
      setPendingSection(section);
      return;
    }
    applySectionSwitch(section);
  };

  return (
    <div className="admin-page">
      <Navbar />
      <main className="container-fluid px-3 px-lg-4 admin-main">
        <header className="admin-header">
          <div><span>ADMIN CONTROL</span><h1>Settings</h1><p>Manage your profile, sign-in security, and account details.</p></div>
          <div className="admin-header-actions"><button className="btn btn-outline-secondary" onClick={() => loadProfile(true)}><FaSyncAlt /> Refresh</button></div>
        </header>

        {loading ? <div className="admin-loading"><div className="spinner-border text-primary" /><span>Loading settings…</span></div> : (
          <div className="settings-grid">
            <aside className="admin-panel settings-navigation">
              <div className="settings-avatar">{profile.fullname?.charAt(0).toUpperCase() || "A"}</div>
              <strong>{profile.fullname}</strong><span>{profile.email}</span>
              <nav><button className={activeSection === "profile" ? "active" : ""} onClick={() => switchSection("profile")}><FaUser /><div><strong>Profile</strong><small>Name and email</small></div></button><button className={activeSection === "security" ? "active" : ""} onClick={() => switchSection("security")}><FaLock /><div><strong>Security</strong><small>Update password</small></div></button></nav>
              <div className="settings-role"><FaShieldAlt /><div><small>Account role</small><strong>Administrator</strong></div></div>
            </aside>

            <section className="admin-panel settings-content">
              {activeSection === "profile" ? (
                <><div className="admin-panel-heading"><div><h2>Profile information</h2><p>Keep your administrator contact details current.</p></div><span className="admin-heading-icon"><FaIdBadge /></span></div><form className="admin-form" onSubmit={saveProfile}><label><span>Full name</span><div className="settings-input-icon"><FaUser /><input className="form-control" value={profile.fullname} onChange={(event) => setProfile((current) => ({ ...current, fullname: event.target.value }))} required /></div></label><label><span>Email address</span><div className="settings-input-icon"><FaEnvelope /><input className="form-control" type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} required /></div></label><div className="settings-account-id"><span>Account ID</span><code>{profile.id || "Not available"}</code></div><div className="settings-form-actions"><button type="button" className="btn btn-outline-secondary" disabled={!profileChanged} onClick={() => setProfile(initialProfile)}>Reset</button><button className="btn btn-primary" disabled={!profileChanged || saving}><FaSave /> {saving ? "Saving…" : "Save profile"}</button></div></form></>
              ) : (
                <><div className="admin-panel-heading"><div><h2>Sign-in security</h2><p>Create a strong new password for your admin account.</p></div><span className="admin-heading-icon"><FaLock /></span></div><form className="admin-form" onSubmit={saveProfile}><label><span>New password</span><div className="admin-password-input"><input className="form-control" type={showPasswords ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Enter a new password" autoComplete="new-password" required /><button type="button" onClick={() => setShowPasswords((value) => !value)}>{showPasswords ? <FaEyeSlash /> : <FaEye />}</button></div></label><div className="password-checks">{passwordChecks.map((check) => <span key={check.label} className={check.valid ? "valid" : ""}><FaCheck /> {check.label}</span>)}</div><label><span>Confirm new password</span><input className={`form-control ${confirmPassword && newPassword !== confirmPassword ? "is-invalid" : ""}`} type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat the new password" autoComplete="new-password" required />{confirmPassword && <small className={newPassword === confirmPassword ? "text-success" : "text-danger"}>{newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}</small>}</label><div className="settings-security-note"><FaShieldAlt /><p><strong>Security reminder</strong><span>Changing your password does not sign you out of the current session.</span></p></div><div className="settings-form-actions"><button type="button" className="btn btn-outline-secondary" disabled={!securityChanged} onClick={() => { setNewPassword(""); setConfirmPassword(""); }}>Clear</button><button className="btn btn-primary" disabled={!passwordValid || newPassword !== confirmPassword || saving}><FaSave /> {saving ? "Updating…" : "Update password"}</button></div></form></>
              )}
            </section>
          </div>
        )}
      </main>
      <ConfirmDialog
        open={Boolean(pendingSection)}
        variant="warning"
        title="Discard unsaved changes?"
        description="The changes on this settings page have not been saved and will be lost."
        confirmLabel="Discard changes"
        onConfirm={() => {
          applySectionSwitch(pendingSection);
          setPendingSection(null);
        }}
        onClose={() => setPendingSection(null)}
      />
    </div>
  );
};

export default ManageAdmin;
