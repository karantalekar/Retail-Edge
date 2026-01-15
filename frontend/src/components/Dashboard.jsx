import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Dashboard.css";
import { Tooltip } from "bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();

  // Initialize tooltips
  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section text-center text-white d-flex flex-column align-items-center justify-content-center">
        <div className="hero-content">
          <h1 className="display-4 fw-bold animate__fadeInDown">
            Welcome to RetailEdge
          </h1>
          <p className="lead animate__fadeInUp">
            Your ultimate Retail Management Dashboard
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center text-primary fw-bold mb-5">🚀 Features</h2>

        <div className="row g-4">
          {[
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
          ].map((feature, index) => (
            <div className="col-md-4" key={index}>
              <div
                className="card feature-card h-100 shadow-sm text-center p-3"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={feature.tooltip}
              >
                <img
                  src={feature.img}
                  className="card-img-top feature-img animate-icon"
                  alt={feature.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Illustration */}
      <div className="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Retail Edge Illustration"
          width="150"
          className="animate__animated animate__pulse animate__infinite"
        />
      </div>

      {/* Floating Login Button */}
      <button
        className="btn btn-primary btn-lg position-fixed"
        style={{
          bottom: "30px",
          right: "30px",
          borderRadius: "50px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
        }}
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
};

export default Dashboard;
