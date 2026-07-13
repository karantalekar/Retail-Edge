import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";
import "../style/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPath = pathname.toLowerCase();

  const isActive = (...paths) =>
    paths.some((path) => currentPath === path.toLowerCase());

  const [staffOpen, setStaffOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setLogoutOpen(false);
    toast.success("Signed out successfully");
    navigate("/Login");
  };

  return (
    <nav className="navbar navbar-expand-lg retail-admin-navbar fixed-top shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand navbar-brand-logo fw-bold text-primary fs-4" to="/">
          <img src="/logo.svg" alt="RetailEdge" />
          <span>RetailEdge</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link
                className={`nav-link underline-link ${
                  isActive("/Addproduct") ? "active-page" : ""
                }`}
                to="/Addproduct"
                aria-current={isActive("/Addproduct") ? "page" : undefined}
              >
                Inventory
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link underline-link ${
                  isActive("/Report") ? "active-page" : ""
                }`}
                to="/Report"
                aria-current={isActive("/Report") ? "page" : undefined}
              >
                Reports
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link underline-link ${
                  isActive("/Analytics") ? "active-page" : ""
                }`}
                to="/Analytics"
                aria-current={isActive("/Analytics") ? "page" : undefined}
              >
                Analytics
              </Link>
            </li>

            {/* STAFF DROPDOWN */}
            <li
              className={`nav-item dropdown ${staffOpen ? "show" : ""}`}
              onMouseEnter={() =>
                window.innerWidth >= 992 && setStaffOpen(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 992 && setStaffOpen(false)
              }
            >
              <button
                className={`nav-link dropdown-toggle btn btn-link ${
                  isActive("/Registration", "/ManageStaff")
                    ? "active-page"
                    : ""
                }`}
                onClick={() => setStaffOpen(!staffOpen)}
              >
                Staff
              </button>

              <ul className={`dropdown-menu ${staffOpen ? "show" : ""}`}>
                <li>
                  <button
                    className={`dropdown-item ${
                      isActive("/Registration") ? "active" : ""
                    }`}
                    onClick={() => navigate("/Registration")}
                  >
                    Add Staff
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${
                      isActive("/ManageStaff") ? "active" : ""
                    }`}
                    onClick={() => navigate("/ManageStaff")}
                  >
                    Manage Staff
                  </button>
                </li>
              </ul>
            </li>

            {/* ADMIN DROPDOWN */}
            <li
              className={`nav-item dropdown ${adminOpen ? "show" : ""}`}
              onMouseEnter={() =>
                window.innerWidth >= 992 && setAdminOpen(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 992 && setAdminOpen(false)
              }
            >
              <button
                className={`nav-link dropdown-toggle btn btn-link d-flex align-items-center ${
                  isActive("/ManageAdmin") ? "active-page" : ""
                }`}
                onClick={() => setAdminOpen(!adminOpen)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Admin"
                  width="35"
                  height="35"
                  className="rounded-circle me-2"
                />
                Admin
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-end ${
                  adminOpen ? "show" : ""
                }`}
              >
                <li>
                  <button
                    className={`dropdown-item ${
                      isActive("/ManageAdmin") ? "active" : ""
                    }`}
                    onClick={() => navigate("/ManageAdmin")}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      setAdminOpen(false);
                      setLogoutOpen(true);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <ConfirmDialog
        open={logoutOpen}
        variant="logout"
        title="Sign out of RetailEdge?"
        description="You will need to enter your credentials again to access the admin workspace."
        confirmLabel="Sign out"
        onConfirm={handleLogout}
        onClose={() => setLogoutOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
