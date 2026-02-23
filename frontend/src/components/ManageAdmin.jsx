import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const ManageAdmin = () => {
  const [admin, setAdmin] = useState({
    fullname: "",
    email: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin({
          fullname: res.data.fullname,
          email: res.data.email,
        });
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/me",
        {
          fullname: admin.fullname,
          email: admin.email,
          ...(newPassword && { password: newPassword }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated successfully ✨");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-wrapper">
        <div className="admin-card">
          <h2>👤 Admin Profile</h2>
          <p className="subtitle">Manage your account details</p>

          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={admin.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Optional"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Optional"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit">Update Profile</button>
          </form>
        </div>
      </div>

      {/* Inline styles for single-file usage */}
      <style>{`
        body {
          background: #f4f7fb;
        }

        .admin-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 15px;
          background: linear-gradient(135deg, #eef2ff, #f9fbff);
        }

        .admin-card {
          width: 100%;
          max-width: 460px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
          animation: slideUp 0.6s ease;
        }

        .admin-card h2 {
          text-align: center;
          font-weight: 700;
          color: #1e3a8a;
        }

        .subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 25px;
        }

        .input-group {
          margin-bottom: 18px;
        }

        .input-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #334155;
        }

        .input-group input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(79, 70, 229, 0.35);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ManageAdmin;
