import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import StaffNavbar from "./StaffNavbar";
import { toast } from "react-toastify";

const GenerateBill = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];

  const [customer, setCustomer] = useState({ name: "", mobile: "", email: "" });
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const taxRate = 0.18;

  if (!cart.length)
    return <div className="text-center mt-5">Cart is empty</div>;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;

  const handleChange = (e) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add logo
    const logoImg = "https://cdn-icons-png.flaticon.com/512/3076/3076896.png";
    doc.addImage(logoImg, "PNG", pageWidth - 40, 10, 30, 30);

    // Title
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("Retail Edge Invoice", 14, 25);

    // Date & Time
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${dateStr}`, 14, 35);
    doc.text(`Time: ${timeStr}`, 60, 35);

    // Customer details background
    doc.setFillColor(23, 162, 184);
    doc.rect(14, 40, pageWidth - 28, 20, "F");

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Customer Name: ${customer.name}`, 16, 52);
    doc.text(`Mobile: ${customer.mobile}`, 80, 52);
    doc.text(`Email: ${customer.email}`, 140, 52);

    // Table header
    let startY = 65;
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 123, 255); // header background

    const headers = ["#", "Product", "Qty", "Price (₹)", "Total (₹)"];
    const colPositions = [14, 50, 110, 140, 170];
    const colWidths = [36, 60, 30, 30, 30];

    headers.forEach((header, i) => {
      doc.rect(colPositions[i], startY - 6, colWidths[i], 8, "F"); // fill header
      doc.text(header, colPositions[i] + 1, startY); // draw header text
    });

    startY += 8; // move startY below header

    // Table rows
    doc.setTextColor(0, 0, 0);
    cart.forEach((item, index) => {
      const fill = index % 2 === 0 ? [224, 224, 224] : [255, 255, 255];
      doc.setFillColor(...fill);
      doc.rect(14, startY - 6, pageWidth - 28, 8, "F"); // row background

      doc.text((index + 1).toString(), 16, startY);
      doc.text(item.name, 50, startY);
      doc.text(item.quantity.toString(), 110, startY);
      doc.text(item.price.toFixed(2), 140, startY);
      doc.text((item.quantity * item.price).toFixed(2), 170, startY);

      startY += 8; // move to next row
    });

    // Summary
    startY += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const tax = (subtotal - discount) * taxRate;
    const total = subtotal - discount + tax;

    const summary = [
      { label: "Subtotal", value: subtotal },
      { label: "Discount", value: discount },
      { label: `Tax (${(taxRate * 100).toFixed(0)}%)`, value: tax },
      { label: "Total", value: total },
    ];

    summary.forEach((item, idx) => {
      const y = startY + idx * 6;
      doc.text(`${item.label}: ₹${item.value.toFixed(2)}`, pageWidth - 60, y);
    });

    doc.save("invoice.pdf");
  };

  const saveBill = async () => {
    try {
      setSaving(true);
      const billData = {
        customer,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        discount,
        taxRate,
      };

      const res = await axios.post(
        "https://retail-edge-plw7.onrender.com/api/bills",
        billData,
      );
      toast.success("Bill saved successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save bill , Enter Customer Credential's ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <StaffNavbar />
      <div className="container py-5">
        <h2 className="text-center text-primary fw-bold mb-4">
          💵 Generate Bill
        </h2>

        {/* Customer Details */}
        <div className="card shadow-sm p-4 mb-4">
          <h5>Customer Details</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={customer.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="text"
                name="mobile"
                className="form-control"
                placeholder="Mobile"
                value={customer.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={customer.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="card p-4 mb-4">
          <h5>Items</h5>
          <table className="table table-bordered">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary & Actions */}
        <div className="text-end">
          <div className="mb-2">Subtotal: ₹{subtotal.toFixed(2)}</div>
          <div className="mb-2">
            Discount:{" "}
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">Tax: ₹{tax.toFixed(2)}</div>
          <div className="fw-bold mb-2">Total: ₹{total.toFixed(2)}</div>

          <button className="btn btn-success me-2" onClick={generatePDF}>
            🖨️ Generate PDF
          </button>
          <button
            className="btn btn-primary"
            onClick={saveBill}
            disabled={saving}
          >
            💾 Save Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;
