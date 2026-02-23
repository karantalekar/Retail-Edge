import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffNavbar from "./StaffNavbar";
import "animate.css";

const StaffDashboard = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch products and sales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, salesRes] = await Promise.all([
          axios.get("https://retail-edge-plw7.onrender.com/api/products"),
          axios.get("https://retail-edge-plw7.onrender.com/api/sales"),
        ]);
        setProducts(prodRes.data || []);
        setSales(salesRes.data || []);
        const revenue = salesRes.data.reduce(
          (sum, s) => sum + (s.total || 0),
          0,
        );
        setTotalRevenue(revenue);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        background: "#f0f2f8",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <StaffNavbar />

      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5 animate__animated animate__fadeInDown">
          <h1 className="fw-bold" style={{ color: "#0dcaf0" }}>
            Welcome to Retail Edge 💎
          </h1>
          <p className="text-muted fs-5">
            A smart billing & inventory system designed to streamline daily
            operations with efficiency and elegance.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="row mb-5">
          <div className="col-md-4 mb-3 animate__animated animate__fadeInUp">
            <div className="glass-card p-4 shadow-sm text-center">
              <h6 className="text-primary fw-bold">Total Products</h6>
              <p className="fs-3 fw-semibold">{products.length}</p>
            </div>
          </div>
          <div className="col-md-4 mb-3 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="glass-card p-4 shadow-sm text-center">
              <h6 className="text-success fw-bold">Total Sales</h6>
              <p className="fs-3 fw-semibold">{sales.length}</p>
            </div>
          </div>
          <div className="col-md-4 mb-3 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="glass-card p-4 shadow-sm text-center">
              <h6 className="text-danger fw-bold">Total Revenue</h6>
              <p className="fs-3 fw-semibold">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-4 mb-4 mb-md-0 animate__animated animate__fadeInLeft">
            <div className="glass-card p-3 shadow-sm">
              <img
                src="https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_1280.jpg"
                alt="Retail System"
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div className="col-md-6 animate__animated animate__fadeInRight">
            <h3 className="fw-bold text-secondary mb-3">Why Retail Edge?</h3>
            <ul className="fs-5">
              <li>💡 Easy product management and billing</li>
              <li>📦 Track stock in real-time</li>
              <li>🧾 Generate PDF invoices instantly</li>
              <li>📊 Monitor sales and revenue effectively</li>
            </ul>
          </div>
        </div>

        <div className="row align-items-center mb-5">
          <div className="col-md-6 order-md-2 mb-4 mb-md-0 animate__animated animate__fadeInRight">
            <div className="glass-card p-3 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=400&q=80"
                alt="Analytics"
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div className="col-md-6 order-md-1 animate__animated animate__fadeInLeft">
            <h3 className="fw-bold text-secondary mb-3">Get Started Quickly</h3>
            <p className="fs-5 text-muted">
              Staff can easily add products to cart, generate bills, and help
              customers without complicated steps. Retail Edge ensures smooth
              operations with minimal effort.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 animate__animated animate__fadeInUp">
          <p className="text-muted mb-0">
            &copy; {new Date().getFullYear()} Retail Edge. All rights reserved.
          </p>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .glass-card {
          backdrop-filter: blur(12px) saturate(180%);
          background-color: rgba(255,255,255,0.75);
          border-radius: 16px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
        }
        ul li {
          margin-bottom: 0.5rem;
        }
        h1, h3 {
          letter-spacing: 0.5px;
        }
        @media (max-width: 768px) {
          .glass-card {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffDashboard;
