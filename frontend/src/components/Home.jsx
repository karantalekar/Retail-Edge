// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const Home = () => {
//   const navigate = useNavigate();
//   const [sales, setSales] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [dailySales, setDailySales] = useState([]);

//   useEffect(() => {
//     const user = localStorage.getItem("User");
//     if (!user) navigate("/");
//     else fetchData();
//   }, [navigate]);

//   const fetchData = async () => {
//     try {
//       const [salesRes, productRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/sales"),
//         axios.get("http://localhost:5000/api/products"),
//       ]);

//       setSales(salesRes.data);
//       setProducts(productRes.data);

//       const grouped = {};
//       salesRes.data.forEach((sale) => {
//         const rawDate = sale.date || sale.createdAt;
//         if (!rawDate) return;

//         const d = new Date(rawDate);
//         if (isNaN(d.getTime())) return;

//         const formatted = d.toISOString().split("T")[0]; // yyyy-mm-dd
//         grouped[formatted] = (grouped[formatted] || 0) + sale.totalAmount;
//       });

//       const dailyArray = Object.entries(grouped).map(([date, total]) => ({
//         date,
//         total,
//       }));

//       setDailySales(dailyArray);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Total revenue
//   const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);

//   return (
//     <div>
//       <Navbar />

//       {/* Hero Section */}
//       <section className="bg-light text-center py-5 shadow-sm mt-5">
//         <div className="container">
//           <h1 className="display-5 fw-bold text-primary">
//             Welcome to Retail Edge 🛍️
//           </h1>
//           <p className="lead text-secondary mt-3">
//             Streamline your store operations — manage products, staff, and
//             billing efficiently.
//           </p>
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/3187/3187880.png"
//             alt="Retail Edge Dashboard"
//             className="img-fluid mt-4"
//             width="220"
//           />
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="container my-5">
//         <h2 className="text-center mb-4 fw-semibold">Key Features</h2>
//         <div className="row g-4">
//           <div className="col-md-4">
//             <div className="card h-100 shadow-sm border-0 text-center p-3 card-hover">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
//                 alt="Product Management"
//                 className="img-fluid mx-auto mt-3"
//                 width="100"
//               />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold mt-2">Product Management</h5>
//                 <p className="card-text text-muted">
//                   Add, update, or track products with ease.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="card h-100 shadow-sm border-0 text-center p-3 card-hover">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                 alt="Staff Access"
//                 className="img-fluid mx-auto mt-3"
//                 width="100"
//               />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold mt-2">
//                   Admin & Staff Access
//                 </h5>
//                 <p className="card-text text-muted">
//                   Role-based access control ensures smooth operations.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="card h-100 shadow-sm border-0 text-center p-3 card-hover">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
//                 alt="Billing"
//                 className="img-fluid mx-auto mt-3"
//                 width="100"
//               />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold mt-2">Smart Billing</h5>
//                 <p className="card-text text-muted">
//                   Generate accurate bills and track sales seamlessly.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Charts Section */}
//       <section className="container my-5">
//         <h2 className="text-center fw-semibold mb-4">
//           Real-Time Sales Analytics
//         </h2>
//         <div className="row g-4">
//           {/* Product Stock Chart */}
//           <div className="col-me-6">
//             <div className="card shadow-sm p-3 border-0 h-100">
//               <h5 className="text-center text-success fw-bold mb-3">
//                 Product Stock Levels
//               </h5>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart
//                   data={products.map((p) => ({
//                     name: p.name,
//                     quantity: p.quantity,
//                   }))}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="quantity" fill="#198754" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//         {/* Summary Cards */}
//         <div className="row text-center mt-5">
//           <div className="col-md-4 mb-3">
//             <div className="card shadow-sm border-0 py-3">
//               <h5 className="fw-bold text-primary">Total Products</h5>
//               <p className="fs-4 text-secondary mb-0">{products.length}</p>
//             </div>
//           </div>
//           <div className="col-md-4 mb-3">
//             <div className="card shadow-sm border-0 py-3">
//               <h5 className="fw-bold text-success">Total Sales</h5>
//               {/* <p className="fs-4 text-secondary mb-0">{sales.length}</p> */}
//               <p className="fs-4 text-secondary mb-0">{sales.length}</p>
//             </div>
//           </div>
//           <div className="col-md-4 mb-3">
//             <div className="card shadow-sm border-0 py-3">
//               <h5 className="fw-bold text-danger">Total Revenue</h5>
//               <p className="fs-4 text-secondary mb-0">
//                 ₹{totalRevenue.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       {/* <footer className="text-center py-3 bg-dark text-white mt-5">
//         <p className="mb-0">
//           © {new Date().getFullYear()} Retail Edge. All rights reserved.
//         </p>
//       </footer> */}
//     </div>
//   );
// };

// export default Home;

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

const Home = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [salesRes, productRes] = await Promise.all([
        axios.get("http://localhost:5000/api/sales", {
          withCredentials: true,
        }),
        axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        }),
      ]);

      setSales(salesRes.data || []);
      setProducts(productRes.data || []);

      const grouped = {};

      (salesRes.data || []).forEach((sale) => {
        const rawDate = sale.date || sale.createdAt;
        if (!rawDate) return;

        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return;

        const formatted = d.toISOString().split("T")[0];
        grouped[formatted] = (grouped[formatted] || 0) + (sale.total || 0);
      });

      const dailyArray = Object.entries(grouped)
        .map(([date, total]) => ({
          date,
          total,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setDailySales(dailyArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/Login");
          return;
        }

        const meRes = await axios.get("http://localhost:5000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Send token in Authorization header
          },
          withCredentials: true,
        });

        if (meRes?.data) {
          localStorage.setItem("user", JSON.stringify(meRes.data));
          // console.log("Auth check passed, loading data..."); // debugging
          await fetchData();
        } else {
          localStorage.removeItem("user");
          navigate("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("user");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [navigate]);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <section className="bg-light text-center py-5 shadow-sm mt-5">
        <div className="container">
          <h1 className="display-5 fw-bold text-primary">
            Welcome to Retail Edge 🛍️
          </h1>
          <p className="lead text-secondary mt-3">
            Streamline your store operations — manage products, staff, and
            billing efficiently.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3187/3187880.png"
            alt="Retail Edge Dashboard"
            className="img-fluid mt-4"
            width="220"
          />
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center mb-4 fw-semibold">Key Features</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-3 card-hover">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                alt="Product Management"
                className="img-fluid mx-auto mt-3"
                width="100"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold mt-2">Product Management</h5>
                <p className="card-text text-muted">
                  Add, update, or track products with ease.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-3 card-hover">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Staff Access"
                className="img-fluid mx-auto mt-3"
                width="100"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold mt-2">
                  Admin & Staff Access
                </h5>
                <p className="card-text text-muted">
                  Role-based access control ensures smooth operations.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-3 card-hover">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
                alt="Billing"
                className="img-fluid mx-auto mt-3"
                width="100"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold mt-2">Smart Billing</h5>
                <p className="card-text text-muted">
                  Generate accurate bills and track sales seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center fw-semibold mb-4">
          Real-Time Sales Analytics
        </h2>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm p-3 border-0 h-100">
              <h5 className="text-center text-success fw-bold mb-3">
                Product Stock Levels
              </h5>
              <ResponsiveContainer width="100%" height={250}>
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
                  <Bar dataKey="quantity" fill="#198754" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm p-3 border-0 h-100">
              <h5 className="text-center text-primary fw-bold mb-3">
                Daily Sales
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="row text-center mt-5">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm border-0 py-3">
              <h5 className="fw-bold text-primary">Total Products</h5>
              <p className="fs-4 text-secondary mb-0">{products.length}</p>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm border-0 py-3">
              <h5 className="fw-bold text-success">Total Sales</h5>
              <p className="fs-4 text-secondary mb-0">{sales.length}</p>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm border-0 py-3">
              <h5 className="fw-bold text-danger">Total Revenue</h5>
              <p className="fs-4 text-secondary mb-0">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
