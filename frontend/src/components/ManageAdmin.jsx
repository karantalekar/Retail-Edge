import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const ManageAdmin = () => {
  const [admin, setAdmin] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch admin data on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming you stored JWT
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin({
          fullname: res.data.fullname,
          email: res.data.email,
          password: "", // never show password
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch admin data");
      }
    };
    fetchAdmin();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  // Update admin details
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/me",
        {
          fullname: admin.fullname,
          email: admin.email,
          ...(newPassword && { password: newPassword }), // only update if provided
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5 mt-5">
        <h2 className="text-center text-primary fw-bold mb-4">
          🛠 Manage Admin Profile
        </h2>

        <div
          className="card shadow-sm border-0 mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="card-body">
            <form onSubmit={handleUpdate}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={admin.fullname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={admin.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank if not changing"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Leave blank if not changing"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAdmin;
