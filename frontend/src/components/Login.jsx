import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter email and password!");
      return;
    }

    try {
      const res = await axios.post(
        "https://retail-edge-6kx1.onrender.com/api/login",
        { email, password },
        {
          withCredentials: true, // 🔥 REQUIRED for cookie auth
        },
      );

      toast.success(res.data.message || "Login successful");

      const user = res.data.user;
      const token = res.data.token;

      if (!user || !token) {
        toast.error("No user data or token received");
        return;
      }

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // SAFE ROLE HANDLING
      const role = user.role?.toLowerCase().trim();

      // 🔥 Add delay before navigation to ensure state updates
      setTimeout(() => {
        if (role === "admin") {
          navigate("/Home");
        } else if (role === "staff") {
          navigate("/Staffdashboard");
        } else {
          toast.error("Unknown role detected!");
        }
      }, 1000); // 1 second delay for toast and state to settle
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "Login failed");
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill"
                  >
                    Login
                  </button>
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
