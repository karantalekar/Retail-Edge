// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import PrivateRoute from "../Context/PrivateRoute";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const { email, password, role } = formData;

//   //   // Simple validation
//   //   if (!email || !password || !role) {
//   //     alert("Please fill in all fields!");
//   //     return;
//   //   }

//   //   try {
//   //     const res = await axios.post("http://localhost:5000/api/login", {
//   //       email,
//   //       password,
//   //       role,
//   //     });

//   //     alert(res.data.message);

//   //     // save session or token
//   //     localStorage.setItem("User", JSON.stringify(res.data.user));

//   //     // Navigate based on role
//   //     if (role.toLowerCase() === "staff") {
//   //       navigate("/Staffdashboard");
//   //     } else if (role.toLowerCase() === "admin") {
//   //       navigate("/Home");
//   //     } else {
//   //       alert("Invalid role selected!");
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     navigate("/Login");
//   //     alert("Login failed. Please try again.");
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { email, password, role } = formData;

//     // Simple validation
//     if (!email || !password || !role) {
//       alert("Please fill in all fields!");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:5000/api/login", {
//         email,
//         password,
//         role,
//       });

//       // Save token
//       localStorage.setItem("token", res.data.token);

//       // Decode token to get user info
//       const decoded = jwtDecode(res.data.token);

//       // Optional: store user info for quick access
//       localStorage.setItem("User", JSON.stringify(decoded));

//       // Navigate based on role
//       if (decoded.role.toLowerCase() === "admin") {
//         navigate("/Home");
//       } else if (decoded.role.toLowerCase() === "staff") {
//         navigate("/Staffdashboard");
//       } else {
//         alert("Invalid role detected!");
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Login failed. Please try again.");
//     }
//   };
//   return (
//     <div
//       className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
//       style={{
//         background: "linear-gradient(to right, #f5f9ff, #e9eff6)",
//         fontFamily: "Poppins, sans-serif",
//       }}
//     >
//       <div className="container p-4">
//         <div className="text-center mb-4">
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/1034/1034146.png"
//             width="70"
//             alt="Retail Edge Logo"
//           />
//           <h2 className="mt-2 fw-bold text-primary">Retail Edge Login</h2>
//         </div>

//         <div className="row justify-content-center align-items-center">
//           {/* Left Image */}
//           <div className="col-md-5 d-none d-md-block">
//             <img
//               src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg"
//               alt="Login Illustration"
//               className="img-fluid rounded shadow-sm"
//             />
//           </div>

//           {/* Login Form */}
//           <div className="col-md-6 col-lg-5">
//             <div className="card shadow-lg border-0 rounded-4">
//               <div className="card-body p-4">
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-3">
//                     <label className="form-label">Email Address</label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       name="email"
//                       placeholder="Enter your email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       name="password"
//                       placeholder="Enter your password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Login As</label>
//                     <select
//                       className="form-select"
//                       name="role"
//                       value={formData.role}
//                       onChange={handleChange}
//                       required
//                     >
//                       <option value="">Select Role</option>
//                       <option value="admin">Admin</option>
//                       <option value="staff">Staff</option>
//                     </select>
//                   </div>

//                   <button
//                     type="submit"
//                     className="btn btn-primary w-100 rounded-pill"
//                   >
//                     Login
//                   </button>

//                   <p className="text-center mt-3 mb-0">
//                     Don’t have an account?{" "}
//                     <Link
//                       to="/"
//                       className="text-decoration-none fw-bold text-primary"
//                     >
//                       Register Here
//                     </Link>
//                   </p>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      alert("Please enter email and password!");
      return;
    }

    try {
      // Login API (no role sent)
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Decode token to get user info (including role)
      const decoded = jwtDecode(res.data.token);

      // Optional: store user info for later use
      localStorage.setItem("User", JSON.stringify(decoded));

      // Redirect based on role
      if (decoded.role?.toLowerCase() === "admin") {
        navigate("/Home");
      } else if (decoded.role?.toLowerCase() === "staff") {
        navigate("/Staffdashboard");
      } else {
        alert("Unknown role detected!");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(to right, #f5f9ff, #e9eff6)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="container p-4">
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1034/1034146.png"
            width="70"
            alt="Retail Edge Logo"
          />
          <h2 className="mt-2 fw-bold text-primary">Retail Edge Login</h2>
        </div>

        <div className="row justify-content-center align-items-center">
          {/* Left Image */}
          <div className="col-md-5 d-none d-md-block">
            <img
              src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg"
              alt="Login Illustration"
              className="img-fluid rounded shadow-sm"
            />
          </div>

          {/* Login Form */}
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill"
                  >
                    Login
                  </button>

                  <p className="text-center mt-3 mb-0">
                    Don’t have an account?{" "}
                    <Link
                      to="/"
                      className="text-decoration-none fw-bold text-primary"
                    >
                      Register Here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
