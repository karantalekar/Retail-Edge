import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaBoxOpen,
  FaChartLine,
  FaExclamationTriangle,
  FaReceipt,
  FaSyncAlt,
  FaWallet,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import api from "../config/api";
import "../style/Analytics.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444"];

const Analytics = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [salesRes, productsRes] = await Promise.all([
        api.get("/sales"),
        api.get("/products"),
      ]);
      setSales(Array.isArray(salesRes.data) ? salesRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      if (silent) toast.success("Analytics refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Unable to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const filteredSales = useMemo(() => {
    if (range === "all") return sales;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - Number(range) + 1);
    return sales.filter((sale) => {
      const date = new Date(sale.createdAt || sale.date);
      return !Number.isNaN(date.getTime()) && date >= start;
    });
  }, [range, sales]);

  const analytics = useMemo(() => {
    const trend = {};
    const productMap = {};
    const staffMap = {};
    let revenue = 0;
    let itemCount = 0;

    filteredSales.forEach((sale) => {
      const total = Number(sale.total || sale.totalAmount || 0);
      const date = new Date(sale.createdAt || sale.date);
      revenue += total;

      if (!Number.isNaN(date.getTime())) {
        const key = date.toISOString().slice(0, 10);
        trend[key] = (trend[key] || 0) + total;
      }

      (Array.isArray(sale.items) ? sale.items : []).forEach((item) => {
        const quantity = Number(item.quantity || 0);
        const itemRevenue = quantity * Number(item.price || 0);
        itemCount += quantity;
        if (!productMap[item.name]) {
          productMap[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productMap[item.name].quantity += quantity;
        productMap[item.name].revenue += itemRevenue;
      });

      const staffName = sale.staff?.fullname || "Unknown staff";
      if (!staffMap[staffName]) {
        staffMap[staffName] = { name: staffName, orders: 0, revenue: 0 };
      }
      staffMap[staffName].orders += 1;
      staffMap[staffName].revenue += total;
    });

    return {
      revenue,
      itemCount,
      averageOrder: filteredSales.length ? revenue / filteredSales.length : 0,
      trend: Object.entries(trend)
        .map(([date, value]) => ({
          date: new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
          revenue: value,
        }))
        .slice(-30),
      topProducts: Object.values(productMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 7),
      staff: Object.values(staffMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    };
  }, [filteredSales]);

  const lowStock = products.filter((product) => Number(product.quantity) < 5);
  const inventoryUnits = products.reduce(
    (total, product) => total + Number(product.quantity || 0),
    0,
  );

  const metrics = [
    {
      label: "Net revenue",
      value: currency.format(analytics.revenue),
      note: `${filteredSales.length} completed orders`,
      icon: <FaWallet />,
      tone: "blue",
    },
    {
      label: "Average order value",
      value: currency.format(analytics.averageOrder),
      note: `${analytics.itemCount} items sold`,
      icon: <FaReceipt />,
      tone: "teal",
    },
    {
      label: "Inventory units",
      value: inventoryUnits.toLocaleString("en-IN"),
      note: `${products.length} product lines`,
      icon: <FaBoxOpen />,
      tone: "purple",
    },
    {
      label: "Low stock alerts",
      value: lowStock.length,
      note: "Products below 5 units",
      icon: <FaExclamationTriangle />,
      tone: "amber",
    },
  ];

  return (
    <div className="analytics-page">
      <Navbar />
      <main className="container-fluid px-3 px-lg-4 analytics-main">
        <header className="analytics-header">
          <div className="analytics-actions">
            <select
              className="form-select"
              value={range}
              onChange={(event) => setRange(event.target.value)}
              aria-label="Analytics date range"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button
              className="btn btn-primary"
              onClick={() => loadAnalytics(true)}
              disabled={refreshing}
            >
              <FaSyncAlt className={refreshing ? "spin" : ""} /> Refresh
            </button>
          </div>
        </header>

        {loading ? (
          <div className="analytics-loading">
            <div className="spinner-border text-primary" role="status" />
            <span>Preparing analytics…</span>
          </div>
        ) : (
          <>
            <section className="analytics-metrics">
              {metrics.map((metric) => (
                <article className="analytics-metric" key={metric.label}>
                  <div className={`metric-icon ${metric.tone}`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p>{metric.label}</p>
                    <h2>{metric.value}</h2>
                    <small>{metric.note}</small>
                  </div>
                </article>
              ))}
            </section>

            <section className="analytics-grid">
              <article className="analytics-panel analytics-trend">
                <div className="panel-heading">
                  <div>
                    <h3>Revenue trend</h3>
                    <p>Daily revenue performance</p>
                  </div>
                  <FaChartLine className="panel-heading-icon" />
                </div>
                <div className="chart-wrap">
                  {analytics.trend.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.trend}>
                        <defs>
                          <linearGradient
                            id="revenueFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#2563eb"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#2563eb"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis tickLine={false} axisLine={false} width={65} />
                        <Tooltip
                          formatter={(value) => currency.format(value)}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#2563eb"
                          strokeWidth={3}
                          fill="url(#revenueFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-empty">No revenue in this period</div>
                  )}
                </div>
              </article>

              <article className="analytics-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Top products</h3>
                    <p>Ranked by revenue</p>
                  </div>
                </div>
                <div className="chart-wrap">
                  {analytics.topProducts.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.topProducts} layout="vertical">
                        <CartesianGrid
                          strokeDasharray="4 4"
                          horizontal={false}
                        />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={90}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => currency.format(value)}
                        />
                        <Bar
                          dataKey="revenue"
                          fill="#14b8a6"
                          radius={[0, 6, 6, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-empty">
                      No product sales available
                    </div>
                  )}
                </div>
              </article>

              <article className="analytics-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Staff contribution</h3>
                    <p>Share of sales revenue</p>
                  </div>
                </div>
                <div className="chart-wrap">
                  {analytics.staff.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.staff}
                          dataKey="revenue"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                        >
                          {analytics.staff.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => currency.format(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-empty">No staff sales available</div>
                  )}
                </div>
                <div className="staff-legend">
                  {analytics.staff.map((staff, index) => (
                    <div key={staff.name}>
                      <span
                        style={{ background: COLORS[index % COLORS.length] }}
                      />
                      <strong>{staff.name}</strong>
                      <small>{staff.orders} orders</small>
                    </div>
                  ))}
                </div>
              </article>

              <article className="analytics-panel low-stock-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Inventory attention</h3>
                    <p>Items requiring replenishment</p>
                  </div>
                  <span className="alert-count">{lowStock.length}</span>
                </div>
                <div className="stock-list">
                  {lowStock.length ? (
                    lowStock.slice(0, 7).map((product) => (
                      <div
                        className="stock-row"
                        key={product._id || product.name}
                      >
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.category || "Uncategorized"}</small>
                        </div>
                        <span>{product.quantity} left</span>
                      </div>
                    ))
                  ) : (
                    <div className="chart-empty">
                      Inventory levels look healthy
                    </div>
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
