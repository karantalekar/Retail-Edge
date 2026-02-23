import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "../assets/StaffNavbar.css";
import { toast } from "react-toastify";
const StaffNavbar = () => {
  const navigate = useNavigate();
  const [staffOpen, setStaffOpen] = useState(false);

  const handleLogout = () => {
    if (toast.error("do you want to logout ?")) {
      localStorage.removeItem("User");
      localStorage.removeItem("token");
      // alert("Logout Successfully");
      toast.success("Logout Successfully");
      navigate("/Login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold">🛒 Retail Edge - Staff</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#staffNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="staffNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Home */}
            <li className="nav-item me-3">
              <span
                className="nav-hover"
                onClick={() => navigate("/Staffdashboard")}
                style={{ cursor: "pointer" }}
              >
                Home
              </span>
            </li>

            {/* Inventory */}
            <li className="nav-item me-3">
              <span
                className="nav-hover d-flex align-items-center"
                onClick={() => navigate("/Cart")}
                style={{ cursor: "pointer" }}
              >
                <FaShoppingCart className="me-1" /> Inventory
              </span>
            </li>

            {/* User Dropdown */}
            {/* <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle d-flex align-items-center"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Staff"
                  width="35"
                  height="35"
                  className="rounded-circle me-2 border border-primary"
                />
                Staff
              </Link>

              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button
                    className="dropdown-item text-danger fw-semibold"
                    onClick={handleLogout}
                  >
                    <i class="fa-solid fa-right-from-bracket me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li> */}
            <li
              className="nav-item dropdown"
              onMouseEnter={() =>
                window.innerWidth >= 992 && setStaffOpen(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 992 && setStaffOpen(false)
              }
            >
              <button
                className="nav-link dropdown-toggle d-flex align-items-center btn btn-link text-white"
                onClick={() => setStaffOpen(!staffOpen)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Staff"
                  width="35"
                  height="35"
                  className="rounded-circle me-2 border border-primary"
                />
                Staff
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-end shadow-sm ${
                  staffOpen ? "show" : ""
                }`}
              >
                <li>
                  <button
                    className="dropdown-item text-danger fw-semibold"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default StaffNavbar;
