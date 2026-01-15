import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

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
      // alert("Please enter email and password!");
      toast.error("Please enter email and password!");

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
        toast.success("Login Successful");
      } else {
        // alert("Unknown role detected!");
        toast.error("Unknown role detected!");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );

      // alert(err.response?.data?.message || "Login failed. Please try again.");
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
