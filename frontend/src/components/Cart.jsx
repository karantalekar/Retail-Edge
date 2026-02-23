import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import StaffNavbar from "./StaffNavbar";
import "animate.css";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [productQtys, setProductQtys] = useState({});
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [taxRate] = useState(10);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const res = await axios.get("http://localhost:5000/api/products");
        const res = await axios.get("https://retail-edge-plw7.onrender.com/products");
        setProducts(res.data || []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart
  const addToCart = useCallback(
    (productId, qty) => {
      const quantity = parseInt(qty);
      if (!quantity || quantity <= 0) return;
      const product = products.find((p) => p._id === productId);
      if (!product) return;
      if (quantity > product.quantity) {
        toast.error(`Only ${product.quantity} in stock`);
        return;
      }
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          const newQty = existing.quantity + quantity;
          if (newQty > product.quantity) return prev;
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: newQty } : i
          );
        }
        return [...prev, { productId, quantity }];
      });
      setProductQtys((prev) => ({ ...prev, [productId]: "" }));
    },
    [products]
  );

  const removeFromCart = (id) => setCart(cart.filter((item) => item.productId !== id));

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    const p = products.find((pr) => pr._id === item.productId);
    return sum + (p?.price || 0) * item.quantity;
  }, 0);
  const discountRate = subtotal >= 2000 ? 5 : 0; // auto 5% discount
  const discountAmount = (subtotal * discountRate) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  // Process Bill
  const processBill = async () => {
    if (!customer.name.trim()) return toast.error("Customer name required");
    if (cart.length === 0) return toast.error("Cart is empty");
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Login required");
      await axios.post(
        "http://localhost:5000/api/sales",
        {
          customer,
          items: cart,
          subtotal,
          discount: discountRate,
          discountAmount,
          taxRate,
          taxAmount,
          total,
          date: new Date(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bill processed successfully");
      setCart([]);
      setCustomer({ name: "", email: "", phone: "" });
      setProductQtys({});
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process bill.");
    }
  };

  // PDF
  const generatePDF = () => {
    const input = document.getElementById("invoice");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 0);
      pdf.save(`invoice-${Date.now()}.pdf`);
    });
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <>
        <StaffNavbar />
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" />
        </div>
      </>
    );

  return (
    <>
      <StaffNavbar />
      <div className="container-fluid mt-4">

        {/* Customer */}
        <div className="card mb-4 glass p-4 animate__animated animate__fadeInUp">
          <div className="row g-3">
            <div className="col-md-4">
              <input className="form-control" placeholder="Name *" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Phone" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input className="form-control glass" placeholder="Search product..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Products */}
        <div className="card mb-4 glass p-4 animate__animated animate__fadeInUp">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Qty</th><th></th></tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td className={p.quantity < 5 ? "text-danger fw-bold" : ""}>{p.quantity}</td>
                    <td><input type="number" className="form-control form-control-sm" value={productQtys[p._id] || ""} min="1" onChange={e => setProductQtys({ ...productQtys, [p._id]: e.target.value })} /></td>
                    <td><button className="btn btn-sm btn-gradient" onClick={() => addToCart(p._id, productQtys[p._id] || 1)}>Add</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart */}
        <div className="card mb-4 glass p-4 sticky-top animate__animated animate__fadeInUp">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong>Cart</strong>
            <button className="btn btn-success btn-gradient" onClick={processBill}>Process ₹{total.toFixed(2)}</button>
          </div>
          {cart.length === 0 ? <p className="text-muted">Cart is empty</p> :
            <table className="table table-sm">
              <thead><tr><th>Product</th><th>Qty</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {cart.map(item => {
                  const p = products.find(pr => pr._id === item.productId);
                  return (
                    <tr key={item.productId}>
                      <td>{p?.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(p?.price * item.quantity).toFixed(2)}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.productId)}>×</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          }
        </div>

        {/* Invoice */}
        {cart.length > 0 && (
          <div className="card glass p-4 animate__animated animate__fadeInUp">
            <div className="d-flex justify-content-between mb-3">
              <h5>Invoice Preview</h5>
              <button className="btn btn-success btn-gradient" onClick={generatePDF}>📄 Download PDF</button>
            </div>
            <div id="invoice" className="border p-3 bg-white">
              <div className="text-center mb-3"><h2>🛒 Retail Edge</h2><p>Invoice #{Date.now().toString().slice(-6)}</p></div>
              <div><strong>Customer:</strong> {customer.name || "Walk-in"}<br />
                {customer.phone && <><strong>Phone:</strong> {customer.phone}<br /></>}
                {customer.email && <><strong>Email:</strong> {customer.email}</>}
              </div>
              <div className="table-responsive my-2">
                <table className="table table-sm table-borderless">
                  <thead><tr><th>Product</th><th className="text-end">Qty</th><th className="text-end">Price</th><th className="text-end">Total</th></tr></thead>
                  <tbody>
                    {cart.map(item => {
                      const product = products.find(p => p._id === item.productId);
                      return (<tr key={item.productId}>
                        <td>{product?.name}</td>
                        <td className="text-end">{item.quantity}</td>
                        <td className="text-end">₹{product?.price.toFixed(2)}</td>
                        <td className="text-end fw-bold">₹{(product?.price * item.quantity).toFixed(2)}</td>
                      </tr>)
                    })}
                  </tbody>
                </table>
              </div>
              <div className="text-end">
                <div className="d-flex justify-content-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                {discountRate > 0 && <div className="d-flex justify-content-between text-success"><span>Auto Discount (5%)</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
                <div className="d-flex justify-content-between"><span>Tax ({taxRate}%)</span><span>+₹{taxAmount.toFixed(2)}</span></div>
                <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Styles */}
      <style>{`
        body { background: #f0f2f5; font-family: 'Segoe UI', sans-serif; }
        .glass { backdrop-filter: blur(14px) saturate(180%); background-color: rgba(255,255,255,0.75); border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .btn-gradient { background: linear-gradient(135deg,#20c997,#0dcaf0); border:none; color:white; transition:0.3s; }
        .btn-gradient:hover { transform: scale(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.2); }
        .sticky-top { position: sticky; top: 1rem; z-index: 10; }
        table.table-hover tbody tr:hover { background: rgba(32,201,151,0.1); transition:0.3s; }
      `}</style>
    </>
  );
};

export default Cart;
