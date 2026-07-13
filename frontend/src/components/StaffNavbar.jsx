import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaChevronDown, FaCog, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";
import "../assets/StaffNavbar.css";

const StaffNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const profileRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const staffName = storedUser.fullname || "Staff member";

  useEffect(() => {
    const closeProfile = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", closeProfile);
    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncTheme = (event) => {
      document.documentElement.dataset.staffTheme =
        event?.detail || localStorage.getItem("retailEdgeStaffTheme") || "light";
    };
    syncTheme();
    window.addEventListener("retailEdgeStaffThemeChange", syncTheme);
    return () => window.removeEventListener("retailEdgeStaffThemeChange", syncTheme);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLogoutOpen(false);
    toast.success("Signed out successfully");
    navigate("/Login");
  };

  const isActive = (path) => pathname.toLowerCase() === path.toLowerCase();

  return (
    <nav className="staff-navbar">
      <div className="staff-navbar-inner">
        <Link className="staff-navbar-brand" to="/Cart">
          <span><img src="/logo.svg" alt="RetailEdge" /></span>
          <strong>RetailEdge</strong>
          <small>Staff</small>
        </Link>

        <button className="staff-mobile-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`staff-navbar-content ${menuOpen ? "open" : ""}`}>
          <div className="staff-nav-links">
            <Link className={isActive("/Cart") ? "active" : ""} to="/Cart">Inventory</Link>
            <Link className={isActive("/Generatebill") ? "active" : ""} to="/Generatebill">Billing</Link>
          </div>

          <div
            className="staff-profile"
            ref={profileRef}
            onMouseEnter={() => window.innerWidth >= 768 && setProfileOpen(true)}
            onMouseLeave={() => window.innerWidth >= 768 && setProfileOpen(false)}
          >
            <button className="staff-profile-trigger" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
              <span className="staff-avatar">{staffName.charAt(0).toUpperCase()}</span>
              <div><strong>{staffName}</strong><small>Store staff</small></div>
              <FaChevronDown className={profileOpen ? "rotated" : ""} />
            </button>
            <div className={`staff-profile-menu ${profileOpen ? "show" : ""}`}>
              <div className="staff-profile-summary"><FaUser /><div><strong>{staffName}</strong><small>{storedUser.email || "RetailEdge staff account"}</small></div></div>
              <button className="staff-menu-action" onClick={() => navigate("/StaffSettings")}><FaCog /> Settings</button>
              <button className="staff-menu-action signout" onClick={() => { setProfileOpen(false); setLogoutOpen(true); }}><FaSignOutAlt /> Sign out</button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={logoutOpen}
        variant="logout"
        title="Sign out of RetailEdge?"
        description="Your current staff session will end and you’ll return to the login page."
        confirmLabel="Sign out"
        onConfirm={handleLogout}
        onClose={() => setLogoutOpen(false)}
      />
    </nav>
  );
};

export default StaffNavbar;
