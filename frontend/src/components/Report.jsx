import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
const Report = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // New state for date range
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await axios.get("http://localhost:5000/api/sales");
        const productsRes = await axios.get(
          "http://localhost:5000/api/products"
        );
        setSales(salesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchData();
  }, []);

  // Low stock alert
  useEffect(() => {
    const veryLowStock = products.filter((p) => p.quantity < 5);
    if (veryLowStock.length > 0) {
      alert(
        `⚠️ Warning: The following products have stock less than 3!\n` +
          veryLowStock.map((p) => `${p.name} (Stock: ${p.quantity})`).join("\n")
      );
    }
  }, [products]);

  // Handler for applying a date range
  const handleDateRangeFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates!");
      return;
    }
    setSelectedDate("");
    setTimeFilter("range");
  };

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt || sale.date);
    const today = new Date();

    // ---- DATE RANGE FILTER ----
    if (timeFilter === "range" && fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      return saleDate >= start && saleDate <= end;
    }

    // ---- SINGLE DATE FILTER ----
    if (selectedDate) {
      const selected = new Date(selectedDate);
      return (
        saleDate.getDate() === selected.getDate() &&
        saleDate.getMonth() === selected.getMonth() &&
        saleDate.getFullYear() === selected.getFullYear()
      );
    }

    // ---- DAILY FILTER ----
    if (timeFilter === "daily") {
      return (
        saleDate.getDate() === today.getDate() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
      );
    }

    // ---- MONTHLY FILTER ----
    if (timeFilter === "monthly") {
      return (
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
      );
    }

    return true; // ALL
  });

  // PRODUCT-WISE SALES SUMMARY
  const productWiseSales = {};
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const product = products.find((p) => p.name === item.name);
      const category = product ? product.category : "Uncategorized";

      if (productWiseSales[item.name]) {
        productWiseSales[item.name].quantity += item.quantity;
        productWiseSales[item.name].revenue += item.quantity * item.price;
      } else {
        productWiseSales[item.name] = {
          quantity: item.quantity,
          revenue: item.quantity * item.price,
          category,
        };
      }
    });
  });

  // Searching by product/category
  const searchedProducts = Object.entries(productWiseSales).filter(
    ([name, data]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Key metrics
  const totalSales = filteredSales.reduce(
    (acc, s) => acc + (s.total || s.totalAmount || 0),
    0
  );
  const totalProductsSold = filteredSales.reduce(
    (acc, s) => acc + s.items.reduce((iAcc, item) => iAcc + item.quantity, 0),
    0
  );

  const lowStockProducts = products.filter((p) => p.quantity < 5);

  return (
    <div>
      <Navbar />
      <div className="container py-5 mt-5">
        <h2 className="text-center text-primary fw-bold mb-4">
          📊 Sales Report Dashboard
        </h2>

        {/* ---------- FILTERS SECTION ---------- */}
        <div className="d-flex flex-wrap justify-content-center align-items-center mb-4 gap-2">
          {/* All / Daily / Monthly */}
          <button
            className={`btn btn-sm ${
              timeFilter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {
              setTimeFilter("all");
              setSelectedDate("");
              setFromDate("");
              setToDate("");
            }}
          >
            All
          </button>

          <button
            className={`btn btn-sm ${
              timeFilter === "daily" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {
              setTimeFilter("daily");
              setSelectedDate("");
              setFromDate("");
              setToDate("");
            }}
          >
            Daily
          </button>

          <button
            className={`btn btn-sm ${
              timeFilter === "monthly" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {
              setTimeFilter("monthly");
              setSelectedDate("");
              setFromDate("");
              setToDate("");
            }}
          >
            Monthly
          </button>

          {/* Single Date */}

          {/* FROM DATE */}
          <input
            type="date"
            className="form-control form-control-sm w-auto"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          {/* TO DATE */}
          <input
            type="date"
            className="form-control form-control-sm w-auto"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          {/* APPLY RANGE */}
          <button
            onClick={handleDateRangeFilter}
            className="btn btn-sm btn-success"
          >
            Apply Range
          </button>

          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="🔍 Search by product or category"
            className="form-control form-control-sm w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ---------- KEY METRICS ---------- */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm border-0 text-center p-3">
              <h5>Total Sales</h5>
              <h3 className="text-success">₹{totalSales}</h3>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm border-0 text-center p-3">
              <h5>Total Products Sold</h5>
              <h3 className="text-primary">{totalProductsSold}</h3>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm border-0 text-center p-3">
              <h5>Low Stock Products</h5>
              <h3 className="text-danger">{lowStockProducts.length}</h3>
            </div>
          </div>
        </div>

        {/* ---------- PRODUCT WISE TABLE ---------- */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white fw-bold">
            📦 Product-wise Sales Summary
          </div>

          <div className="card-body table-responsive">
            {searchedProducts.length > 0 ? (
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
                  {searchedProducts.map(([name, data], index) => {
                    const product = products.find((p) => p.name === name);
                    const isLowStock = product && product.quantity < 3;

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{name}</td>
                        <td>{data.category}</td>
                        <td
                          style={
                            isLowStock
                              ? { color: "red", fontWeight: "bold" }
                              : {}
                          }
                        >
                          {data.quantity}
                        </td>
                        <td>{data.revenue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted mb-0">
                No sales for selected filters.
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Report illustration"
            width="120"
            className="opacity-75"
          />
        </div>
      </div>
    </div>
  );
};

export default Report;
