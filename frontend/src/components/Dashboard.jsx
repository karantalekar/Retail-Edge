import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBars,
  FaBolt,
  FaBoxOpen,
  FaChartLine,
  FaCheck,
  FaChevronDown,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaLock,
  FaMoon,
  FaReceipt,
  FaShieldAlt,
  FaTimes,
  FaSun,
  FaUsers,
  FaWarehouse,
} from "react-icons/fa";
import "../style/Dashboard.css";

const features = [
  {
    id: "inventory",
    label: "Inventory control",
    title: "Know what is in stock—before your customer asks.",
    description:
      "Track every product, category, unit, and price from one clear operational view.",
    icon: FaBoxOpen,
    accent: "blue",
    metric: "641",
    metricLabel: "units monitored",
    points: ["Fast stock adjustments", "Low-stock status at a glance", "Search, filter, and category control"],
  },
  {
    id: "billing",
    label: "Fast billing",
    title: "Move from cart to polished invoice in moments.",
    description:
      "Give staff a focused billing workflow with customer details, tax, discounts, and downloadable invoices.",
    icon: FaFileInvoiceDollar,
    accent: "teal",
    metric: "3 steps",
    metricLabel: "from product to invoice",
    points: ["Guided checkout", "Automatic totals and tax", "Professional PDF receipts"],
  },
  {
    id: "analytics",
    label: "Sales intelligence",
    title: "Turn daily transactions into confident decisions.",
    description:
      "See revenue, orders, top performers, customer activity, and stock health without wrestling with spreadsheets.",
    icon: FaChartLine,
    accent: "purple",
    metric: "1 view",
    metricLabel: "for business performance",
    points: ["Revenue and order trends", "Product and staff performance", "Decision-ready report exports"],
  },
  {
    id: "team",
    label: "Team access",
    title: "Give every team member exactly the access they need.",
    description:
      "Separate administrator and staff workspaces keep daily operations simple and sensitive controls protected.",
    icon: FaUsers,
    accent: "amber",
    metric: "2 roles",
    metricLabel: "with focused permissions",
    points: ["Admin approval workflow", "Active and inactive controls", "Managed password recovery"],
  },
];

const faqs = [
  {
    question: "Who is RetailEdge designed for?",
    answer:
      "RetailEdge is designed for store owners, administrators, and counter staff who need one straightforward place to manage inventory, billing, people, reports, and analytics.",
  },
  {
    question: "Can staff access administrative settings?",
    answer:
      "No. Role-based workspaces keep staff focused on inventory selection and billing, while administrators control products, team access, analytics, reports, and settings.",
  },
  {
    question: "How does RetailEdge help prevent stock issues?",
    answer:
      "The inventory workspace highlights low and out-of-stock items, supports quick quantity changes, and surfaces inventory attention areas in analytics and reports.",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(features[0]);
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("retailEdgeDashboardTheme") || "light",
  );

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem("retailEdgeDashboardTheme", next);
      return next;
    });
  };
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className={`landing-page ${theme === "dark" ? "landing-dark" : ""}`}>
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <button className="landing-brand" onClick={() => scrollTo("home")}>
            <img src="/logo.svg" alt="" />
            <span>RetailEdge</span>
          </button>
          <button
            className="landing-menu-toggle"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className={`landing-nav-content ${mobileMenuOpen ? "open" : ""}`}>
            <div className="landing-nav-links">
              <button onClick={() => scrollTo("features")}>Features</button>
              <button onClick={() => scrollTo("workflow")}>How it works</button>
              <button onClick={() => scrollTo("faq")}>FAQ</button>
            </div>
            <button
              className="landing-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Use light mode" : "Use dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <button className="landing-login-button" onClick={() => navigate("/Login")}>
              Sign in <FaArrowRight />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-orb orb-one" />
          <div className="landing-orb orb-two" />
          <div className="landing-horizon" aria-hidden="true">
            <i className="horizon-ridge ridge-back" />
            <i className="horizon-ridge ridge-middle" />
            <i className="horizon-ridge ridge-front" />
          </div>
          <div className="landing-hero-inner">
            <div className="landing-hero-copy">
              <span className="landing-kicker"><FaBolt /> One workspace. Every retail moment.</span>
              <h1>Run your store with <span>clarity, speed,</span> and control.</h1>
              <p>
                RetailEdge connects inventory, billing, staff, analytics, and
                reports in one beautifully simple retail workspace.
              </p>
              <div className="landing-hero-actions">
                <button className="landing-primary-button" onClick={() => navigate("/Login")}>
                  Open your workspace <FaArrowRight />
                </button>
                <button className="landing-secondary-button" onClick={() => scrollTo("features")}>
                  Explore the platform
                </button>
              </div>
              <div className="landing-trust-row">
                <span><FaCheck /> Role-secured access</span>
                <span><FaCheck /> Live stock visibility</span>
                <span><FaCheck /> Decision-ready reports</span>
              </div>
            </div>

            <div className="landing-product-stage" aria-label="RetailEdge application preview">
              <div className="landing-product-glow" />
              <div className="landing-app-window">
                <div className="landing-window-bar">
                  <div><span /><span /><span /></div>
                  <p>RetailEdge / Analytics</p>
                  <span className="preview-live"><i /> Live</span>
                </div>
                <div className="landing-app-body">
                  <aside className="preview-sidebar">
                    <div className="preview-logo"><img src="/logo.svg" alt="" /></div>
                    <span className="active"><FaChartLine /></span>
                    <span><FaBoxOpen /></span>
                    <span><FaReceipt /></span>
                    <span><FaUsers /></span>
                  </aside>
                  <div className="preview-content">
                    <div className="preview-heading"><div><small>GOOD MORNING</small><strong>Business overview</strong></div><button>Last 30 days</button></div>
                    <div className="preview-metrics">
                      <article><span>Revenue</span><strong>₹84,240</strong><small>↗ 12.4%</small></article>
                      <article><span>Orders</span><strong>328</strong><small>↗ 8.1%</small></article>
                      <article><span>Stock alerts</span><strong>6</strong><small className="warning">Needs review</small></article>
                    </div>
                    <div className="preview-grid">
                      <article className="preview-chart-card">
                        <div><strong>Revenue trend</strong><span>May</span></div>
                        <div className="preview-chart">
                          {[42, 58, 49, 72, 65, 88, 78, 96, 83, 100, 92, 112].map((height, index) => <i key={index} style={{ height: `${height}px` }} />)}
                        </div>
                        <div className="preview-chart-labels"><span>01</span><span>10</span><span>20</span><span>30</span></div>
                      </article>
                      <article className="preview-stock-card">
                        <strong>Stock health</strong>
                        <div className="preview-donut"><span>94<small>%</small></span></div>
                        <p>Products ready for sale</p>
                        <button>View inventory <FaArrowRight /></button>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
              <div className="landing-floating-card floating-stock"><span><FaWarehouse /></span><div><small>Inventory synced</small><strong>641 units</strong></div></div>
              <div className="landing-floating-card floating-sale"><span><FaReceipt /></span><div><small>Latest sale</small><strong>₹2,480</strong></div></div>
            </div>
          </div>
        </section>

        <section className="landing-proof">
          <div className="landing-proof-inner">
            <p>Everything your retail team needs to stay one step ahead</p>
            <div>
              <span><FaBoxOpen /> Inventory</span>
              <span><FaReceipt /> Billing</span>
              <span><FaUsers /> Staff</span>
              <span><FaChartLine /> Analytics</span>
              <span><FaClipboardList /> Reports</span>
            </div>
          </div>
        </section>

        <section className="landing-section landing-features" id="features">
          <div className="landing-section-heading">
            <span>BUILT FOR REAL RETAIL WORK</span>
            <h2>Powerful where it matters.<br />Simple everywhere else.</h2>
            <p>Explore the connected workflows that keep your store moving.</p>
          </div>
          <div className="landing-feature-explorer">
            <div className="landing-feature-tabs" role="tablist">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <button key={feature.id} className={activeFeature.id === feature.id ? "active" : ""} onClick={() => setActiveFeature(feature)} role="tab" aria-selected={activeFeature.id === feature.id}>
                    <span className={`feature-tab-icon ${feature.accent}`}><Icon /></span>
                    <div><strong>{feature.label}</strong><small>{feature.description}</small></div>
                    <FaArrowRight />
                  </button>
                );
              })}
            </div>
            <div className={`landing-feature-preview ${activeFeature.accent}`} key={activeFeature.id}>
              <span className="feature-preview-icon"><activeFeature.icon /></span>
              <h3>{activeFeature.title}</h3>
              <p>{activeFeature.description}</p>
              <ul>{activeFeature.points.map((point) => <li key={point}><FaCheck /> {point}</li>)}</ul>
              <div className="feature-preview-metric"><strong>{activeFeature.metric}</strong><span>{activeFeature.metricLabel}</span></div>
            </div>
          </div>
        </section>

        <section className="landing-workflow" id="workflow">
          <div className="landing-workflow-inner">
            <div className="landing-workflow-copy">
              <span>FROM OPENING TO CLOSING</span>
              <h2>A calmer way to run every day.</h2>
              <p>RetailEdge keeps the operational loop connected, so your team always knows what comes next.</p>
              <button onClick={() => navigate("/Login")}>Start with RetailEdge <FaArrowRight /></button>
            </div>
            <div className="landing-steps">
              <article><span>01</span><div><FaWarehouse /><h3>Stock with confidence</h3><p>Add products, organize categories, and see inventory health instantly.</p></div></article>
              <article><span>02</span><div><FaFileInvoiceDollar /><h3>Sell without friction</h3><p>Help staff build carts and create accurate customer bills quickly.</p></div></article>
              <article><span>03</span><div><FaChartLine /><h3>Learn and improve</h3><p>Review trends, top performers, and reports to plan the next move.</p></div></article>
            </div>
          </div>
        </section>

        <section className="landing-section landing-security">
          <div className="landing-security-card">
            <div className="landing-security-visual"><span><FaLock /></span><i className="security-ring ring-one" /><i className="security-ring ring-two" /></div>
            <div className="landing-security-copy">
              <span>ACCESS WITH INTENTION</span>
              <h2>Simple for staff. Controlled by admins.</h2>
              <p>RetailEdge gives each role a focused experience, backed by account approval, activation controls, secure sessions, and managed recovery.</p>
              <div><span><FaShieldAlt /> Role-based workspaces</span><span><FaCheck /> Admin-approved staff access</span><span><FaLock /> Protected management actions</span></div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-faq" id="faq">
          <div className="landing-section-heading compact"><span>COMMON QUESTIONS</span><h2>Everything you need to know.</h2></div>
          <div className="landing-faq-list">
            {faqs.map((faq, index) => (
              <article className={openFaq === index ? "open" : ""} key={faq.question}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{faq.question}</span><FaChevronDown /></button>
                <div><p>{faq.answer}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta-orb" />
          <img src="/logo.svg" alt="" />
          <span>YOUR STORE. SHARPER.</span>
          <h2>Ready to work at the retail edge?</h2>
          <p>Sign in and bring inventory, people, billing, and business intelligence together.</p>
          <button onClick={() => navigate("/Login")}>Enter RetailEdge <FaArrowRight /></button>
        </section>
      </main>

      <footer className="landing-footer">
        <div><button className="landing-brand" onClick={() => scrollTo("home")}><img src="/logo.svg" alt="" /><span>RetailEdge</span></button><p>Smarter retail operations, from shelf to sale.</p></div>
        <div><button onClick={() => scrollTo("features")}>Features</button><button onClick={() => scrollTo("workflow")}>How it works</button><button onClick={() => scrollTo("faq")}>FAQ</button><button onClick={() => navigate("/Login")}>Sign in</button></div>
        <small>© {new Date().getFullYear()} RetailEdge. Built for better retail.</small>
      </footer>
    </div>
  );
};

export default Dashboard;
