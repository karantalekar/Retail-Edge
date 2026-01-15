// import React from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ManageAdmin from "./ManageAdmin";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     if (
//       window.confirm("do you want to logout ?")
//       // toast.error("do you want to logout ?")
//     ) {
//       try {
//         // Session handling - Session end
//         localStorage.removeItem("User");
//         localStorage.removeItem("token");
//         // alert("Logout Successfully");
//         toast.success("Logout Successfully");

//         navigate("/Login");
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
//       <div className="container-fluid px-4">
//         {/* Brand Logo */}
//         <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
//           RetailEdge
//         </Link>

//         {/* Toggler */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNavDropdown"
//           aria-controls="navbarNavDropdown"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Menu Links */}
//         <div className="collapse navbar-collapse" id="navbarNavDropdown">
//           {/* Right Side: Links + Profile */}
//           <ul className="navbar-nav ms-auto align-items-center gap-2">
//             <li className="nav-item">
//               <Link className="nav-link nav-hover" to="/Home">
//                 Home
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link nav-hover" to="/Addproduct">
//                 Inventory
//               </Link>
//             </li>
//             {/* Report Option */}
//             <li className="nav-item">
//               <Link className="nav-link nav-hover" to="/Report">
//                 Reports
//               </Link>
//             </li>
//             {/* Staff Option */}
//             <li className="nav-item dropdown">
//               <Link
//                 className="nav-link dropdown-toggle d-flex align-items-center"
//                 to="#"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Staff
//               </Link>

//               <ul className="dropdown-menu dropdown-menu-end shadow-sm">
//                 <li className="d-flex flex-column">
//                   <button
//                     className="dropdown-item d-flex align-items-center gap-2 btn btn-link"
//                     onClick={() => navigate("/Registration")}
//                   >
//                     <i className="fa-solid fa-user-plus me-2 text-primary"></i>
//                     Add Staff
//                   </button>

//                   <button
//                     className="dropdown-item d-flex align-items-center gap-2 btn btn-link"
//                     onClick={() => navigate("/ManageStaff")}
//                   >
//                     <i className="fa-solid fa-users-gear me-2 text-success"></i>
//                     Manage Staff
//                   </button>
//                 </li>
//               </ul>
//             </li>

//             {/* Dropdown Profile */}
//             <li className="nav-item dropdown">
//               <Link
//                 className="nav-link dropdown-toggle d-flex align-items-center"
//                 to="#"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                   alt="Admin"
//                   width="35"
//                   height="35"
//                   className="rounded-circle me-2 border border-primary"
//                 />
//                 Admin
//               </Link>
//               <ul className="dropdown-menu dropdown-menu-end shadow-sm">
//                 <li>
//                   <button
//                     type="button"
//                     className="dropdown-item text-danger fw-semibold btn btn-link"
//                     onClick={() => navigate("/ManageAdmin")}
//                   >
//                     {" "}
//                     <i className="fa-solid fa-gear me-2"></i>
//                     Setting
//                   </button>
//                   <button
//                     className="dropdown-item text-danger fw-semibold btn btn-link"
//                     onClick={handleLogout}
//                   >
//                     <i className="fa-solid fa-right-from-bracket me-2"></i>
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [staffOpen, setStaffOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      localStorage.clear();
      toast.success("Logout Successfully");
      navigate("/Login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
          RetailEdge
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
            {/* <li className="nav-item">
              <Link className="nav-link" to="/Home">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Addproduct">
                Inventory
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Report">
                Reports
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link underline-link" to="/Home">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link underline-link" to="/Addproduct">
                Inventory
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link underline-link" to="/Report">
                Reports
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
                className="nav-link dropdown-toggle btn btn-link text-white"
                onClick={() => setStaffOpen(!staffOpen)}
              >
                Staff
              </button>

              <ul className={`dropdown-menu ${staffOpen ? "show" : ""}`}>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Registration")}
                  >
                    Add Staff
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
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
                className="nav-link dropdown-toggle btn btn-link d-flex align-items-center text-white"
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
                    className="dropdown-item"
                    onClick={() => navigate("/ManageAdmin")}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
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
