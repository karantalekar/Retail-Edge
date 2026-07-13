import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import {
  FaArrowLeft,
  FaCheck,
  FaDownload,
  FaEnvelope,
  FaFileInvoice,
  FaMinus,
  FaMobileAlt,
  FaPercent,
  FaPlus,
  FaSave,
  FaShoppingBasket,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import StaffNavbar from "./StaffNavbar";
import ConfirmDialog from "./ConfirmDialog";
import api from "../config/api";
import "../style/StaffWorkspace.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const GenerateBill = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => state?.cart || []);
  const [customer, setCustomer] = useState(
    () => state?.customer || { name: "", mobile: "", email: "" },
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountRate = subtotal < 1000 ? 0.1 : 0.15;
  const discount = subtotal * discountRate;
  const taxableAmount = subtotal - discount;
  const taxRate = 0.18;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  const validateField = (name, value) => {
    const cleanValue = value.trim();
    if (name === "name") {
      if (!cleanValue) return "Customer name is required";
      if (cleanValue.length < 2) return "Enter at least 2 characters";
      if (cleanValue.length > 60) return "Name cannot exceed 60 characters";
      if (!/^[\p{L}\s.'-]+$/u.test(cleanValue)) return "Use letters, spaces, apostrophes, or hyphens only";
    }
    if (name === "mobile") {
      if (!cleanValue) return "Mobile number is required";
      if (!/^[6-9]\d{9}$/.test(cleanValue)) return "Enter a valid 10-digit Indian mobile number";
    }
    if (name === "email" && cleanValue) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanValue)) return "Enter a valid email address";
      if (cleanValue.length > 100) return "Email cannot exceed 100 characters";
    }
    return "";
  };

  const handleChange = (event) => {
    const { name } = event.target;
    const value = name === "mobile"
      ? event.target.value.replace(/\D/g, "").slice(0, 10)
      : event.target.value;
    setCustomer((current) => ({ ...current, [name]: value }));
    if (touched[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
    setSaved(false);
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  };

  const customerIsValid = () => {
    const nextErrors = Object.fromEntries(
      Object.entries(customer).map(([name, value]) => [name, validateField(name, value)]),
    );
    setErrors(nextErrors);
    setTouched({ name: true, mobile: true, email: true });
    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please correct the highlighted customer details");
      return false;
    }
    return true;
  };

  const updateItemQuantity = (item, difference) => {
    if (saved) return;
    setCart((current) =>
      current
        .map((entry) => {
          if (entry._id !== item._id) return entry;
          const available = entry.availableQuantity || entry.quantity;
          return {
            ...entry,
            quantity: Math.min(Math.max(entry.quantity + difference, 0), available),
          };
        })
        .filter((entry) => entry.quantity > 0),
    );
  };

  const removeItem = (id) => {
    if (!saved) setCart((current) => current.filter((item) => item._id !== id));
  };

  const addMoreProducts = () => navigate("/Cart", { state: { cart, customer } });

  const cancelBill = () => {
    setCancelOpen(false);
    toast.info("Bill cancelled");
    navigate("/Cart", { replace: true });
  };

  const generatePDF = () => {
    if (!customerIsValid()) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 22;

    doc.setFillColor(235, 242, 255);
    doc.roundedRect(12, 10, pageWidth - 24, 34, 4, 4, "F");
    doc.setTextColor(48, 74, 112);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("RetailEdge Invoice", 18, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Issued ${new Date().toLocaleString("en-IN")}`, 18, y + 9);
    doc.text(`Customer: ${customer.name}`, 18, y + 16);
    doc.text(`Mobile: ${customer.mobile}${customer.email ? `  |  ${customer.email}` : ""}`, 85, y + 16);

    y = 55;
    doc.setFillColor(91, 125, 176);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.rect(14, y, pageWidth - 28, 9, "F");
    ["Product", "Qty", "Unit price", "Amount"].forEach((label, index) => {
      doc.text(label, [18, 112, 138, 172][index], y + 6);
    });
    y += 9;

    cart.forEach((item, index) => {
      doc.setFillColor(index % 2 ? 250 : 245, 248, 252);
      doc.rect(14, y, pageWidth - 28, 9, "F");
      doc.setTextColor(53, 68, 91);
      doc.setFont("helvetica", "normal");
      doc.text(item.name.slice(0, 38), 18, y + 6);
      doc.text(String(item.quantity), 114, y + 6);
      doc.text(`Rs. ${item.price.toFixed(2)}`, 138, y + 6);
      doc.text(`Rs. ${(item.price * item.quantity).toFixed(2)}`, 172, y + 6, { align: "right" });
      y += 9;
    });

    y += 8;
    doc.setTextColor(53, 68, 91);
    const summary = [
      ["Subtotal", subtotal],
      [`Automatic discount (${discountRate * 100}%)`, -discount],
      ["GST (18%)", tax],
      ["Total", total],
    ];
    summary.forEach(([label, value], index) => {
      doc.setFont("helvetica", index === summary.length - 1 ? "bold" : "normal");
      doc.setFontSize(index === summary.length - 1 ? 12 : 10);
      doc.text(label, 126, y);
      doc.text(`${value < 0 ? "-" : ""}Rs. ${Math.abs(value).toFixed(2)}`, 192, y, { align: "right" });
      y += index === summary.length - 1 ? 8 : 7;
    });
    doc.save(`RetailEdge-${customer.name.trim().replace(/\s+/g, "-")}.pdf`);
    toast.success("Invoice downloaded");
  };

  const saveBill = async () => {
    if (!customerIsValid()) return;
    try {
      setSaving(true);
      await api.post("/bills", {
        customer: {
          name: customer.name.trim(),
          mobile: customer.mobile.trim(),
          email: customer.email.trim(),
        },
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        taxRate,
      });
      setSaved(true);
      toast.success("Sale completed and inventory updated");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to save this bill");
    } finally {
      setSaving(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="staff-workspace">
        <StaffNavbar />
        <main className="staff-empty-bill">
          <span><FaShoppingBasket /></span>
          <small>BILLING WORKSPACE</small>
          <h1>No order ready to bill</h1>
          <p>Add products from inventory before preparing an invoice.</p>
          <button onClick={() => navigate("/Cart")}><FaArrowLeft /> Return to inventory</button>
        </main>
      </div>
    );
  }

  return (
    <div className="staff-workspace">
      <StaffNavbar />
      <main className="staff-shell staff-bill-shell">
        <header className="staff-page-header">
          <div>
            <button className="staff-back-link" onClick={addMoreProducts}><FaArrowLeft /> Back to inventory</button>
            <span className="staff-eyebrow">BILLING WORKSPACE</span>
            <h1>Review and generate bill</h1>
            <p>Confirm customer details, totals, and the automatic discount.</p>
          </div>
          <div className="staff-bill-header-actions">
            <button className="add" onClick={addMoreProducts} disabled={saved}><FaPlus /> Add products</button>
            <button className="cancel" onClick={() => setCancelOpen(true)} disabled={saved}>Cancel bill</button>
            <span className={`staff-bill-status ${saved ? "complete" : "draft"}`}>
              {saved ? <><FaCheck /> Sale completed</> : "Draft invoice"}
            </span>
          </div>
        </header>

        <div className="staff-bill-layout">
          <section className="staff-bill-main">
            <article className="staff-bill-card">
              <div className="staff-section-heading">
                <span>01</span><div><h2>Customer details</h2><p>Used on the invoice and sales record.</p></div>
              </div>
              <div className="staff-customer-form">
                <label className={errors.name ? "invalid" : touched.name ? "valid" : ""}>
                  <span>Customer name *</span>
                  <div><FaUser /><input name="name" value={customer.name} onChange={handleChange} onBlur={handleBlur} placeholder="Enter full name" maxLength={60} aria-invalid={Boolean(errors.name)} aria-describedby="customer-name-error" /></div>
                  {errors.name && <small id="customer-name-error" className="staff-field-error">{errors.name}</small>}
                </label>
                <label className={errors.mobile ? "invalid" : touched.mobile ? "valid" : ""}>
                  <span>Mobile number *</span>
                  <div><FaMobileAlt /><input name="mobile" value={customer.mobile} onChange={handleChange} onBlur={handleBlur} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel" maxLength={10} aria-invalid={Boolean(errors.mobile)} aria-describedby="customer-mobile-error" /></div>
                  {errors.mobile && <small id="customer-mobile-error" className="staff-field-error">{errors.mobile}</small>}
                </label>
                <label className={`wide ${errors.email ? "invalid" : touched.email ? "valid" : ""}`}>
                  <span>Email address <em>Optional</em></span>
                  <div><FaEnvelope /><input type="email" name="email" value={customer.email} onChange={handleChange} onBlur={handleBlur} placeholder="customer@example.com" autoComplete="email" maxLength={100} aria-invalid={Boolean(errors.email)} aria-describedby="customer-email-error" /></div>
                  {errors.email && <small id="customer-email-error" className="staff-field-error">{errors.email}</small>}
                </label>
              </div>
            </article>

            <article className="staff-bill-card">
              <div className="staff-section-heading">
                <span>02</span><div><h2>Order items</h2><p>{cart.length} products · {cart.reduce((sum, item) => sum + item.quantity, 0)} units</p></div>
              </div>
              <div className="staff-bill-table-wrap">
                <table className="staff-bill-table">
                  <thead><tr><th>Product</th><th>Unit price</th><th>Quantity</th><th>Amount</th><th aria-label="Actions" /></tr></thead>
                  <tbody>{cart.map((item) => <tr key={item._id}><td><strong>{item.name}</strong><small>{item.category}</small></td><td>{money.format(item.price)}</td><td><div className="staff-bill-quantity"><button onClick={() => updateItemQuantity(item, -1)} disabled={saved}><FaMinus /></button><span>{item.quantity}</span><button onClick={() => updateItemQuantity(item, 1)} disabled={saved || item.quantity >= (item.availableQuantity || item.quantity)}><FaPlus /></button></div></td><td><strong>{money.format(item.price * item.quantity)}</strong></td><td><button className="staff-bill-remove" onClick={() => removeItem(item._id)} disabled={saved} aria-label={`Remove ${item.name}`}><FaTrash /></button></td></tr>)}</tbody>
                </table>
              </div>
            </article>
          </section>

          <aside className="staff-checkout-card">
            <div className="staff-checkout-title"><span><FaFileInvoice /></span><div><small>INVOICE SUMMARY</small><h2>Amount due</h2></div></div>
            <div className="staff-auto-discount"><FaPercent /><div><strong>{discountRate * 100}% automatic discount</strong><span>{subtotal < 1000 ? "Orders below ₹1,000" : "Orders of ₹1,000 and above"}</span></div></div>
            <div className="staff-checkout-lines">
              <div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div>
              <div className="discount"><span>Discount</span><strong>-{money.format(discount)}</strong></div>
              <div><span>Taxable amount</span><strong>{money.format(taxableAmount)}</strong></div>
              <div><span>GST (18%)</span><strong>{money.format(tax)}</strong></div>
            </div>
            <div className="staff-checkout-total"><span>Total payable</span><strong>{money.format(total)}</strong><small>Inclusive of GST after discount</small></div>
            <div className="staff-checkout-actions">
              <button className="download" onClick={generatePDF}><FaDownload /> Download PDF</button>
              <button className="save" onClick={saveBill} disabled={saving || saved}>{saved ? <><FaCheck /> Bill saved</> : saving ? "Saving sale…" : <><FaSave /> Complete sale</>}</button>
            </div>
            <p className="staff-checkout-note"><FaCheck /> Saving the sale automatically updates product stock.</p>
          </aside>
        </div>
      </main>
      <ConfirmDialog
        open={cancelOpen}
        variant="warning"
        title="Cancel this bill?"
        description="The current order and customer details will be discarded. Inventory stock will not be changed."
        confirmLabel="Cancel bill"
        onConfirm={cancelBill}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  );
};

export default GenerateBill;
