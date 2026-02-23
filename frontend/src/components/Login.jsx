import React, { useState ,useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "animate.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  useEffect(() => {
    setFormData({ email: "", password: "" });
  }, []);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        "https://retail-edge-plw7.onrender.com/api/login",
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      localStorage.setItem("User", JSON.stringify(decoded));

      toast.success("Login Successful 🚀");

      if (decoded.role?.toLowerCase() === "admin") {
        navigate("/Home");
      } else if (decoded.role?.toLowerCase() === "staff") {
        navigate("/Staffdashboard");
      } else {
        toast.error("Unknown role detected!");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <>
      {/* Inline Styles */}
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
        }

        .login-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          animation: slideUp 1s ease forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-img {
          animation: floatImg 5s ease-in-out infinite;
        }

        @keyframes floatImg {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }

        .form-control {
          border-radius: 12px;
          padding: 12px;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        .login-btn {
          padding: 12px;
          border-radius: 50px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          transition: all 0.4s ease;
        }

        .login-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }

        .logo {
          animation: pulseLogo 2.5s infinite;
        }

        @keyframes pulseLogo {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="container-fluid login-bg d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            {/* Left Illustration */}
            <div className="col-md-6 d-none d-md-block text-center">
              <img
                src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg"
                alt="Login Illustration"
                className="img-fluid login-img"
              />
            </div>

            {/* Login Card */}
            <div className="col-md-6 col-lg-4">
              <div className="glass-card p-4 shadow-lg">
                <div className="text-center mb-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1034/1034146.png"
                    width="70"
                    alt="Retail Edge"
                    className="logo"
                  />
                  <h3 className="mt-3 fw-bold text-primary">
                    Retail Edge Login
                  </h3>
                  <p className="text-muted">
                    Welcome back! Please login to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn login-btn text-white w-100 fw-bold"
                  >
                    Login
                  </button>
                </form>

                <div className="text-center mt-3 text-muted small">
                  Secure login powered by RetailEdge 🔒
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
