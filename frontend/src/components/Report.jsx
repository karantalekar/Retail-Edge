import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4D4D",
  "#FF99C8",
  "#33CCFF",
];

const Report = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch sales and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const salesRes = await axios.get("http://localhost:5000/api/sales", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsRes = await axios.get("http://localhost:5000/api/products");
        setSales(salesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        toast.error("Error fetching report data");
      }
    };
    fetchData();
  }, []);

  // Low stock alert
  useEffect(() => {
    const veryLowStock = products.filter((p) => p.quantity < 5);
    if (veryLowStock.length > 0) {
      toast.warning(
        `⚠️ Warning: The following products have stock less than 5!\n` +
          veryLowStock.map((p) => `${p.name} (Stock: ${p.quantity})`).join("\n")
      );
    }
  }, [products]);

  // Handle date range filter
  const handleDateRangeFilter = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates!");
      return;
    }
    setTimeFilter("range");
  };

  // Filter sales by date
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt || sale.date);
    const today = new Date();

    if (timeFilter === "range" && fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      return saleDate >= start && saleDate <= end;
    }

    if (timeFilter === "daily") {
      return (
        saleDate.getDate() === today.getDate() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
      );
    }

    return true; // all
  });

  // Product-wise summary
  const productWiseSales = {};
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const productName = item.productName || item.product?.name || "Unknown";
      const product = products.find((p) => p.name === productName);
      const category = product ? product.category : "Uncategorized";

      if (productWiseSales[productName]) {
        productWiseSales[productName].quantity += item.quantity;
        productWiseSales[productName].revenue += item.quantity * item.price;
      } else {
        productWiseSales[productName] = {
          quantity: item.quantity,
          revenue: item.quantity * item.price,
          category,
        };
      }
    });
  });

  // Staff-wise summary
  const staffWiseSales = {};
  filteredSales
    .filter((sale) => sale.staff && sale.staff.role === "staff")
    .forEach((sale) => {
      const staffName = sale.staff.fullname;
      staffWiseSales[staffName] = (staffWiseSales[staffName] || 0) + (sale.total || 0);
    });

  const staffSalesArray = Object.entries(staffWiseSales)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  // Pie chart data
  const productPieData = Object.entries(productWiseSales).map(([name, data]) => ({
    name,
    value: data.revenue,
  }));

  const staffPieData = staffSalesArray.map((s) => ({
    name: s.name,
    value: s.total,
  }));

  // Total metrics
  const totalRevenue = filteredSales.reduce((acc, s) => acc + (s.total || 0), 0).toFixed(2);
  const totalProductsSold = filteredSales.reduce(
    (acc, s) => acc + s.items.reduce((iAcc, item) => iAcc + item.quantity, 0),
    0
  );
  const totalSales = filteredSales.length;

  return (
    <div>
      <Navbar />
      <div className="container py-5 mt-5">
        <h2 className="text-center text-primary fw-bold mb-4">
          📊 Sales Report Dashboard
        </h2>

        {/* ---------- KPI CARDS ---------- */}
        <div className="d-flex flex-wrap justify-content-center mb-4 gap-3">
          <div className="card shadow-sm border-0 p-3 text-center" style={{ width: "180px", borderRadius: "1rem" }}>
            <h6 className="text-muted">Total Sales</h6>
            <h4 className="fw-bold">{totalSales}</h4>
          </div>
          <div className="card shadow-sm border-0 p-3 text-center" style={{ width: "180px", borderRadius: "1rem" }}>
            <h6 className="text-muted">Total Products Sold</h6>
            <h4 className="fw-bold">{totalProductsSold}</h4>
          </div>
          <div className="card shadow-sm border-0 p-3 text-center" style={{ width: "180px", borderRadius: "1rem" }}>
            <h6 className="text-muted">Total Revenue (₹)</h6>
            <h4 className="fw-bold">₹{totalRevenue}</h4>
          </div>
        </div>

        {/* ---------- FILTERS ---------- */}
        <div className="d-flex flex-wrap justify-content-center align-items-center mb-4 gap-2">
          <button
            className={`btn btn-sm ${timeFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => {
              setTimeFilter("all");
              setFromDate("");
              setToDate("");
            }}
          >
            All
          </button>

          <button
            className={`btn btn-sm ${timeFilter === "daily" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => {
              setTimeFilter("daily");
              setFromDate("");
              setToDate("");
            }}
          >
            Daily
          </button>

          <input
            type="date"
            className="form-control form-control-sm w-auto"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control form-control-sm w-auto"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button onClick={handleDateRangeFilter} className="btn btn-sm btn-success">
            Apply Range
          </button>
        </div>

        {/* ---------- PIE CHARTS ---------- */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="card shadow-lg border-0 p-3" style={{ borderRadius: "1rem" }}>
              <h5 className="text-center mb-3 fw-bold">📦 Product Revenue Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive
                  >
                    {productPieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-lg border-0 p-3" style={{ borderRadius: "1rem" }}>
              <h5 className="text-center mb-3 fw-bold">🧑‍💼 Staff Sales Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={staffPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive
                  >
                    {staffPieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ---------- PRODUCT TABLE ---------- */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-primary text-white fw-bold">
            📦 Product-wise Sales Summary
          </div>
          <div className="card-body table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Quantity Sold</th>
                  <th>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(productWiseSales).map(([name, data], index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{data.category}</td>
                    <td>{data.quantity}</td>
                    <td>₹{data.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------- STAFF TABLE ---------- */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-success text-white fw-bold">
            🧑‍💼 Staff-wise Sales Summary
          </div>
          <div className="card-body table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Staff</th>
                  <th>Total Sales (₹)</th>
                </tr>
              </thead>
              <tbody>
                {staffSalesArray.map((staff, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{staff.name}</td>
                    <td>₹{staff.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
