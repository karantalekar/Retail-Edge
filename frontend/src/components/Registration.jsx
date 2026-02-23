import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔐 Password Validation
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(password);
  };

  // 📝 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, role } = formData;

    if (!fullName || !email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be 8+ chars and include uppercase, lowercase, number & symbol",
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://retail-edge-plw7.onrender.com/api/register",
        formData,
      );

      toast.success("User registered successfully 🎉");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "",
      });

      // optional redirect
      // navigate("/users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center mt-4"
        style={{
          background: "linear-gradient(to right, #e9f0f7, #f5f8fb)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div className="container p-4">
          <div className="text-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1034/1034146.png"
              width="70"
              alt="User Icon"
              // className="mt-1"
            />
            <h3 className="mt-2 fw-bold text-primary">Add User</h3>
          </div>

          <div className="row justify-content-center align-items-center">
            {/* Left Image */}
            <div className="col-md-5 d-none d-md-block">
              <img
                src="https://img.freepik.com/free-vector/warehouse-concept-illustration_114360-1151.jpg"
                alt="Retail Management"
                className="img-fluid rounded shadow-sm"
              />
            </div>

            {/* Registration Form */}
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Password */}
                    <div className="mb-1">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Password Hint */}
                    <small
                      className={
                        formData.password.length === 0
                          ? "text-muted"
                          : validatePassword(formData.password)
                            ? "text-success"
                            : "text-danger"
                      }
                    >
                      Password must be 8+ chars, include A-Z, a-z, number &
                      symbol
                    </small>

                    {/* Role */}
                    <div className="mb-3 mt-3">
                      <label className="form-label">Register As</label>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="">Select Role</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 rounded-pill"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add User"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
