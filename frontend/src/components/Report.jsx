import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaCalendarAlt,
  FaDownload,
  FaFilter,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import api from "../config/api";
import "../style/Report.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const reportLabels = {
  product: "Product performance",
  staff: "Staff performance",
  customer: "Customer performance",
};

const Report = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [reportType, setReportType] = useState("product");
  const [preset, setPreset] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedRange, setAppliedRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("revenue-desc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReport = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [salesRes, productsRes] = await Promise.all([
        api.get("/sales"),
        api.get("/products"),
      ]);
      setSales(Array.isArray(salesRes.data) ? salesRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      if (silent) toast.success("Report data refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Unable to load report data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const applyCustomRange = () => {
    if (!fromDate || !toDate) {
      toast.error("Select both start and end dates");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }
    setAppliedRange({ from: fromDate, to: toDate });
    setPreset("custom");
  };

  const selectPreset = (value) => {
    setPreset(value);
    setAppliedRange(null);
    setFromDate("");
    setToDate("");
  };

  const filteredSales = useMemo(() => {
    if (preset === "all") return sales;

    let start;
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    if (preset === "custom" && appliedRange) {
      start = new Date(`${appliedRange.from}T00:00:00`);
      end = new Date(`${appliedRange.to}T23:59:59.999`);
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      if (preset === "today") {
        // Start already points at today.
      } else if (preset === "7d") {
        start.setDate(start.getDate() - 6);
      } else if (preset === "30d") {
        start.setDate(start.getDate() - 29);
      } else if (preset === "month") {
        start = new Date(start.getFullYear(), start.getMonth(), 1);
      }
    }

    return sales.filter((sale) => {
      const date = new Date(sale.createdAt || sale.date);
      return !Number.isNaN(date.getTime()) && date >= start && date <= end;
    });
  }, [appliedRange, preset, sales]);

  const summaries = useMemo(() => {
    const productMap = {};
    const staffMap = {};
    const customerMap = {};

    filteredSales.forEach((sale) => {
      const items = Array.isArray(sale.items) ? sale.items : [];
      const saleTotal = Number(sale.total || sale.totalAmount || 0);
      const totalItems = items.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );

      items.forEach((item) => {
        const name = item.name || "Unknown product";
        const product = products.find((entry) => entry.name === name);
        if (!productMap[name]) {
          productMap[name] = {
            key: name,
            name,
            category: product?.category || "Uncategorized",
            quantity: 0,
            orders: 0,
            revenue: 0,
          };
        }
        productMap[name].quantity += Number(item.quantity || 0);
        productMap[name].orders += 1;
        productMap[name].revenue +=
          Number(item.quantity || 0) * Number(item.price || 0);
      });

      const staffName = sale.staff?.fullname || "Unknown staff";
      const staffKey = String(
        sale.staff?.userId || sale.staff?._id || staffName,
      );
      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          key: staffKey,
          name: staffName,
          email: sale.staff?.email || "—",
          orders: 0,
          quantity: 0,
          revenue: 0,
        };
      }
      staffMap[staffKey].orders += 1;
      staffMap[staffKey].quantity += totalItems;
      staffMap[staffKey].revenue += saleTotal;

      const customerName = sale.customer?.name || "Unknown customer";
      const customerKey = String(
        sale.customer?.mobile || sale.customer?.email || customerName,
      );
      if (!customerMap[customerKey]) {
        customerMap[customerKey] = {
          key: customerKey,
          name: customerName,
          mobile: sale.customer?.mobile || "—",
          email: sale.customer?.email || "—",
          orders: 0,
          quantity: 0,
          revenue: 0,
        };
      }
      customerMap[customerKey].orders += 1;
      customerMap[customerKey].quantity += totalItems;
      customerMap[customerKey].revenue += saleTotal;
    });

    return {
      product: Object.values(productMap),
      staff: Object.values(staffMap),
      customer: Object.values(customerMap),
    };
  }, [filteredSales, products]);

  const visibleRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const rows = summaries[reportType].filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );

    return rows.sort((a, b) => {
      if (sortBy === "revenue-asc") return a.revenue - b.revenue;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "orders-desc") return b.orders - a.orders;
      if (sortBy === "quantity-desc") return b.quantity - a.quantity;
      return b.revenue - a.revenue;
    });
  }, [reportType, searchTerm, sortBy, summaries]);

  const metrics = useMemo(() => {
    const revenue = filteredSales.reduce(
      (total, sale) => total + Number(sale.total || sale.totalAmount || 0),
      0,
    );
    const units = filteredSales.reduce(
      (total, sale) =>
        total +
        (Array.isArray(sale.items)
          ? sale.items.reduce(
              (subtotal, item) => subtotal + Number(item.quantity || 0),
              0,
            )
          : 0),
      0,
    );
    const customers = new Set(
      filteredSales.map(
        (sale) =>
          sale.customer?.mobile ||
          sale.customer?.email ||
          sale.customer?.name,
      ),
    ).size;

    return {
      revenue,
      units,
      customers,
      average: filteredSales.length ? revenue / filteredSales.length : 0,
    };
  }, [filteredSales]);

  const chartData = visibleRows.slice(0, 8).map((row) => ({
    name: row.name,
    revenue: row.revenue,
  }));

  const exportCsv = () => {
    if (!visibleRows.length) {
      toast.info("There is no report data to export");
      return;
    }

    const headers =
      reportType === "product"
        ? ["Name", "Category", "Orders", "Quantity", "Revenue"]
        : reportType === "staff"
          ? ["Name", "Email", "Orders", "Items", "Revenue"]
          : ["Name", "Mobile", "Email", "Orders", "Items", "Revenue"];

    const values = visibleRows.map((row) =>
      reportType === "product"
        ? [row.name, row.category, row.orders, row.quantity, row.revenue]
        : reportType === "staff"
          ? [row.name, row.email, row.orders, row.quantity, row.revenue]
          : [
              row.name,
              row.mobile,
              row.email,
              row.orders,
              row.quantity,
              row.revenue,
            ],
    );
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...values]
      .map((row) => row.map(escape).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType}-sales-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  const renderTableHead = () => (
    <tr>
      <th>#</th>
      <th>{reportType === "product" ? "Product" : reportType === "staff" ? "Staff" : "Customer"}</th>
      {reportType === "product" && <th>Category</th>}
      {reportType === "staff" && <th>Email</th>}
      {reportType === "customer" && (
        <>
          <th>Mobile</th>
          <th>Email</th>
        </>
      )}
      <th>Orders</th>
      <th>{reportType === "product" ? "Quantity sold" : "Items sold"}</th>
      <th className="text-end">Revenue</th>
    </tr>
  );

  return (
    <div className="report-page">
      <Navbar />
      <main className="container-fluid px-3 px-lg-4 report-main">
        <header className="report-header">
          <div className="report-header-actions">
            <button
              className="btn btn-outline-secondary"
              onClick={() => loadReport(true)}
              disabled={refreshing}
            >
              <FaSyncAlt className={refreshing ? "spin" : ""} /> Refresh
            </button>
            <button className="btn btn-primary" onClick={exportCsv}>
              <FaDownload /> Export CSV
            </button>
          </div>
        </header>

        <section className="report-filter-card">
          <div className="report-type-tabs" role="tablist">
            {["product", "staff", "customer"].map((type) => (
              <button
                key={type}
                className={reportType === type ? "active" : ""}
                onClick={() => {
                  setReportType(type);
                  setSearchTerm("");
                }}
                role="tab"
                aria-selected={reportType === type}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}-wise
              </button>
            ))}
          </div>

          <div className="report-filter-row">
            <div className="preset-group">
              <FaCalendarAlt />
              {[
                ["all", "All time"],
                ["today", "Today"],
                ["7d", "7 days"],
                ["30d", "30 days"],
                ["month", "This month"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={preset === value ? "active" : ""}
                  onClick={() => selectPreset(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="custom-range">
              <input
                type="date"
                className="form-control form-control-sm"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                aria-label="Start date"
              />
              <span>to</span>
              <input
                type="date"
                className="form-control form-control-sm"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => setToDate(event.target.value)}
                aria-label="End date"
              />
              <button className="btn btn-sm btn-dark" onClick={applyCustomRange}>
                <FaFilter /> Apply
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="report-loading">
            <div className="spinner-border text-primary" role="status" />
            <span>Building your report…</span>
          </div>
        ) : (
          <>
            <section className="report-metrics">
              <article><span>Revenue</span><strong>{currency.format(metrics.revenue)}</strong></article>
              <article><span>Orders</span><strong>{filteredSales.length}</strong></article>
              <article><span>Units sold</span><strong>{metrics.units}</strong></article>
              <article><span>Average order</span><strong>{currency.format(metrics.average)}</strong></article>
              <article><span>Customers</span><strong>{metrics.customers}</strong></article>
            </section>

            <section className="report-content-grid">
              <article className="report-panel report-chart-panel">
                <div className="report-panel-heading">
                  <div>
                    <h2>{reportLabels[reportType]}</h2>
                    <p>Top results ranked by revenue</p>
                  </div>
                </div>
                <div className="report-chart">
                  {chartData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={65} />
                        <Tooltip formatter={(value) => currency.format(value)} />
                        <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="report-empty">No data for the selected period</div>
                  )}
                </div>
              </article>

              <article className="report-panel report-insight-panel">
                <h2>Report snapshot</h2>
                <div className="snapshot-item">
                  <span>Highest performer</span>
                  <strong>{visibleRows[0]?.name || "—"}</strong>
                </div>
                <div className="snapshot-item">
                  <span>Top revenue</span>
                  <strong>{currency.format(visibleRows[0]?.revenue || 0)}</strong>
                </div>
                <div className="snapshot-item">
                  <span>Report entries</span>
                  <strong>{visibleRows.length}</strong>
                </div>
                <div className="snapshot-item">
                  <span>Inventory alerts</span>
                  <strong>{products.filter((product) => Number(product.quantity) < 5).length}</strong>
                </div>
              </article>
            </section>

            <section className="report-panel report-table-panel">
              <div className="report-table-toolbar">
                <div>
                  <h2>{reportLabels[reportType]}</h2>
                  <p>{visibleRows.length} matching entries</p>
                </div>
                <div className="table-controls">
                  <label className="report-search">
                    <FaSearch />
                    <input
                      type="search"
                      placeholder="Search report…"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    aria-label="Sort report"
                  >
                    <option value="revenue-desc">Revenue: high to low</option>
                    <option value="revenue-asc">Revenue: low to high</option>
                    <option value="orders-desc">Most orders</option>
                    <option value="quantity-desc">Most items</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                {visibleRows.length ? (
                  <table className="table report-table align-middle mb-0">
                    <thead>{renderTableHead()}</thead>
                    <tbody>
                      {visibleRows.map((row, index) => (
                        <tr key={row.key}>
                          <td>{index + 1}</td>
                          <td><strong>{row.name}</strong></td>
                          {reportType === "product" && <td><span className="category-badge">{row.category}</span></td>}
                          {reportType === "staff" && <td>{row.email}</td>}
                          {reportType === "customer" && (
                            <><td>{row.mobile}</td><td>{row.email}</td></>
                          )}
                          <td>{row.orders}</td>
                          <td>{row.quantity}</td>
                          <td className="text-end revenue-cell">{currency.format(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="report-empty table-empty">
                    <FaSearch />
                    <strong>No matching report data</strong>
                    <span>Try another date range or search term.</span>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Report;
