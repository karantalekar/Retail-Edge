import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });

    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  }, []);

  const features = [
    {
      title: "Manage Inventory",
      desc: "Add, update, and track all products in your inventory easily.",
      img: "https://cdn-icons-png.flaticon.com/512/263/263115.png",
      tooltip: "Add, edit, delete products",
    },
    {
      title: "Stock Update",
      desc: "Keep your stock levels up-to-date with automatic updates.",
      img: "https://cdn-icons-png.flaticon.com/512/869/869636.png",
      tooltip: "Automatic or manual stock update",
    },
    {
      title: "Low Stock Alert",
      desc: "Get notifications when product stock drops below the limit.",
      img: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
      tooltip: "Alerts for low inventory",
    },
    {
      title: "Manage Staff",
      desc: "Add, edit, approve, or deactivate staff with ease.",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      tooltip: "Staff management dashboard",
    },
    {
      title: "Live Stock Auto Update",
      desc: "Monitor stock changes in real-time without manual refresh.",
      img: "https://cdn-icons-png.flaticon.com/512/2910/2910765.png",
      tooltip: "Live updates in dashboard",
    },
    {
      title: "Reports",
      desc: "Generate sales reports: daily, monthly, or custom date ranges.",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
      tooltip: "Check sales performance",
    },
  ];

  return (
    <>
      {/* Inline Styles */}
      <style>{`
        body {
          background: #f8fafc;
        }

        .hero-section {
          height: 90vh;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
        }

        .hero-content {
          animation: floatHero 6s ease-in-out infinite;
        }

        @keyframes floatHero {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }

        .feature-card {
          border-radius: 18px;
          transition: all 0.4s ease;
          background: white;
        }

        .feature-card:hover {
          transform: translateY(-14px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }

        .feature-img {
          width: 80px;
          margin: 20px auto;
          transition: transform 0.4s ease;
        }

        .feature-card:hover .feature-img {
          transform: scale(1.15) rotate(5deg);
        }

        .floating-illustration {
          animation: breathe 3.5s ease-in-out infinite;
        }

        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        .floating-login-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          border-radius: 50px;
          padding: 14px 32px;
          z-index: 9999;
          animation: slideInBtn 1s ease forwards, pulseGlow 2.5s infinite;
        }

        @keyframes slideInBtn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(13,110,253,0.6);
          }
          70% {
            box-shadow: 0 0 0 18px rgba(13,110,253,0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(13,110,253,0);
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section text-white d-flex align-items-center justify-content-center text-center">
        <div className="hero-content">
          <h1 className="display-4 fw-bold animate__animated animate__fadeInDown">
            Welcome to RetailEdge
          </h1>
          <p className="lead animate__animated animate__fadeInUp animate__delay-1s">
            Your ultimate Retail Management Dashboard
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5 text-primary">
          🚀 Features
        </h2>

        <div className="row g-4">
          {features.map((f, i) => (
            <div className="col-md-4" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <div
                className="feature-card text-center p-4 h-100"
                data-bs-toggle="tooltip"
                title={f.tooltip}
              >
                <img src={f.img} alt={f.title} className="feature-img" />
                <h5 className="fw-bold">{f.title}</h5>
                <p className="text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Illustration */}
      <div className="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          width="150"
          alt="Retail Illustration"
          className="floating-illustration"
        />
      </div>

      {/* Floating Login Button */}
      <button
        className="btn btn-primary btn-lg floating-login-btn"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </>
  );
};

export default Dashboard;
