import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // we have to use async when we use axios
    e.preventDefault(); // stops that automatic refresh
    try {
      await axios.post("http://localhost:5000/api/register", formData); // await will wait untill request send jabtak request bhejoge nahi tab tak ye wait karega .
      console.log(formData);
      alert("Registration Successful ");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "",
      });
      navigate("/Login"); // redirect to homepage
      // console.log(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
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
            alt="Retail Edge Logo"
          />
          <h2 className="mt-2 fw-bold text-primary">
            Retail Edge Registration
          </h2>
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
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

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
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Register As</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100 rounded-pill"
                    onClick={handleSubmit}
                  >
                    Register
                  </button>

                  {/* <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-decoration-none fw-bold text-primary"
                    >
                      Login Here
                    </a>
                  </p> */}
                  <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/Login")}
                      className="btn btn-link text-decoration-none fw-bold text-primary p-0"
                      style={{ cursor: "pointer" }}
                    >
                      Login Here
                    </button>
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

export default Registration;
