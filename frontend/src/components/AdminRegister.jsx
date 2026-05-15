// import React, { useState } from "react";
// import axios from "axios";

// const AdminRegister = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     adminKey: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // ─── Handle Input Change ────────────────────────────────────────────────
//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // ─── Validate Form ──────────────────────────────────────────────────────
//   const validateForm = () => {
//     const { fullName, email, password, adminKey } = formData;

//     if (!fullName || !email || !password || !adminKey) {
//       setError("All fields are required");
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError("Invalid email format");
//       return false;
//     }

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters");
//       return false;
//     }

//     return true;
//   };

//   // ─── Submit Form ────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!validateForm()) return;

//     try {
//       setLoading(true);

//       const res = await axios.post("https://retail-edge-6kx1.onrender.com/api/register", {
//         fullName: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         role: "admin",
//         adminKey: formData.adminKey,
//       });

//       setMessage(res.data.message || "Admin registered successfully");

//       // Reset form
//       setFormData({
//         fullName: "",
//         email: "",
//         password: "",
//         adminKey: "",
//       });
//     } catch (err) {
//       setError(
//         err.response?.data?.message || err.message || "Something went wrong",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── UI ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-5">
//           <div className="card shadow-lg border-0">
//             <div className="card-body p-4">
//               <h3 className="text-center mb-4 fw-bold">Admin Registration</h3>

//               {error && (
//                 <div className="alert alert-danger text-center">{error}</div>
//               )}

//               {message && (
//                 <div className="alert alert-success text-center">{message}</div>
//               )}

//               <form onSubmit={handleSubmit}>
//                 {/* Full Name */}
//                 <div className="mb-3">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     placeholder="Enter full name"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter email"
//                     autoComplete="email"
//                   />
//                 </div>

//                 {/* Password */}
//                 <div className="mb-3">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Enter password"
//                     autoComplete="new-password"
//                   />
//                 </div>

//                 {/* Admin Key */}
//                 <div className="mb-3">
//                   <label className="form-label">Admin Key</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     name="adminKey"
//                     value={formData.adminKey}
//                     onChange={handleChange}
//                     placeholder="Enter admin key"
//                     autoComplete="off"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   className="btn btn-dark w-100"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2"></span>
//                       Registering...
//                     </>
//                   ) : (
//                     "Register Admin"
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminRegister;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      const res = await axios.post(
        "https://retail-edge-6kx1.onrender.com/api/admin/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          adminKey: formData.adminKey,
        },
      );

      setMessage(res.data.message || "Admin registered successfully");

      // 🔥 Store token and user info for auto-login
      const token = res.data.token;
      const user = res.data.user;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setFormData({
          fullName: "",
          email: "",
          password: "",
          adminKey: "",
        });

        // Redirect to Home after successful registration
        setTimeout(() => {
          navigate("/Home");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="row shadow-lg bg-white rounded overflow-hidden"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        {/* LEFT SIDE IMAGE */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80"
            alt="admin"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="col-md-6 p-5">
          <div className="text-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920251.png"
              width="70"
              alt="admin icon"
            />
            <h3 className="mt-2 fw-bold">Admin Registration</h3>
            <p className="text-muted">
              Create admin account to access dashboard
            </p>
          </div>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {message && (
            <div className="alert alert-success text-center">{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control mb-3"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <input
              type="email"
              className="form-control mb-3"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <input
              type="password"
              className="form-control mb-3"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />

            <input
              type="password"
              className="form-control mb-3"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              placeholder="Admin Key"
            />

            <button className="btn btn-dark w-100" disabled={loading}>
              {loading ? "Registering..." : "Register Admin"}
            </button>
          </form>

          {/* LOGIN BUTTON */}
          <div className="text-center mt-4">
            <p className="mb-1 text-muted">Already have an account?</p>

            <button
              className="btn btn-outline-primary w-100"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
