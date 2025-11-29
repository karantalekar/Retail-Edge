import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("do you want to logout ?")) {
      try {
        // Session handling - Session end
        localStorage.removeItem("User");
        localStorage.removeItem("token");
        alert("Logout Successfully");
        navigate("/Login");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid px-4">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
          RetailEdge
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Links */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {/* Right Side: Links + Profile */}
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/Home">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/Addproduct">
                Inventory
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/Report">
                Reports
              </Link>
            </li>

            {/* Dropdown Profile */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle d-flex align-items-center"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Admin"
                  width="35"
                  height="35"
                  className="rounded-circle me-2 border border-primary"
                />
                Admin
              </Link>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button
                    className="dropdown-item text-danger fw-semibold btn btn-link"
                    onClick={handleLogout}
                  >
                    {" "}
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

export default Navbar;
