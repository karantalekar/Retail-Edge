import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "animate.css";

const Home = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("User");
    if (!user) navigate("/");
    else fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [salesRes, productRes] = await Promise.all([
        axios.get("https://retail-edge-plw7.onrender.com/sales"),
        axios.get("https://retail-edge-plw7.onrender.com/products"),
      ]);

      setSales(salesRes.data);
      setProducts(productRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <>
      {/* Inline Styles */}
      <style>{`
        body {
          background: #f4f7fb;
        }

        .hero {
          background: linear-gradient(135deg, #1d2671, #c33764);
          color: white;
          padding: 100px 0;
          perspective: 1000px;
        }

        .hero img {
          animation: float3d 6s ease-in-out infinite;
        }

        @keyframes float3d {
          0% { transform: translateY(0) rotateX(0); }
          50% { transform: translateY(-18px) rotateX(6deg); }
          100% { transform: translateY(0) rotateX(0); }
        }

        .card-3d {
          border-radius: 20px;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          transform-style: preserve-3d;
        }

        .card-3d:hover {
          transform: translateY(-14px) rotateX(6deg) rotateY(-6deg);
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }

        .icon-3d {
          transition: transform 0.4s ease;
        }

        .card-3d:hover .icon-3d {
          transform: translateZ(30px) scale(1.15);
        }

        .kpi-card {
          background: linear-gradient(135deg, #ffffff, #f1f4ff);
        }

        .chart-card {
          background: linear-gradient(135deg, #ffffff, #eef7f1);
          border-radius: 20px;
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="hero text-center mt-5 shadow">
        <div className="container">
          <h1 className="display-5 fw-bold animate__animated animate__fadeInDown">
            Welcome to Retail Edge 🛍️
          </h1>
          <p className="lead mt-3 animate__animated animate__fadeInUp">
            A smarter way to manage inventory, staff & sales
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3187/3187880.png"
            alt="Dashboard"
            width="230"
            className="mt-4"
          />
        </div>
      </section>

      {/* Features */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4">Key Features</h2>
        <div className="row g-4">
          {[
            {
              title: "Product Management",
              text: "Add, update, and track inventory effortlessly.",
              img: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
            },
            {
              title: "Admin & Staff Access",
              text: "Role-based access for smooth operations.",
              img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            },
            {
              title: "Smart Billing",
              text: "Accurate billing with real-time sales tracking.",
              img: "https://cdn-icons-png.flaticon.com/512/1170/1170576.png",
            },
          ].map((f, i) => (
            <div className="col-md-4" key={i}>
              <div className="card card-3d h-100 border-0 text-center p-4">
                <img
                  src={f.img}
                  width="100"
                  className="icon-3d mx-auto"
                  alt={f.title}
                />
                <h5 className="fw-bold mt-3">{f.title}</h5>
                <p className="text-muted">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4">Real-Time Stock Analytics</h2>

        <div className="card chart-card shadow p-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={products.map((p) => ({
                name: p.name,
                quantity: p.quantity,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#20c997" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* KPIs */}
        <div className="row text-center mt-5">
          <div className="col-md-4 mb-3">
            <div className="card kpi-card card-3d border-0 py-4">
              <h6 className="text-primary fw-bold">Total Products</h6>
              <p className="fs-3 fw-semibold">{products.length}</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card kpi-card card-3d border-0 py-4">
              <h6 className="text-success fw-bold">Total Sales</h6>
              <p className="fs-3 fw-semibold">{sales.length}</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card kpi-card card-3d border-0 py-4">
              <h6 className="text-danger fw-bold">Total Revenue</h6>
              <p className="fs-3 fw-semibold">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
