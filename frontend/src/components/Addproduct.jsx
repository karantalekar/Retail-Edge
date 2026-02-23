import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://retail-edge-plw7.onrender.com/products",
      );
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Low stock alert
  useEffect(() => {
    const lowStock = products.filter((p) => p.quantity < 3);
    if (lowStock.length > 0) {
      toast.warning(
        "⚠️ Low stock alert:\n" +
          lowStock.map((p) => `${p.name} (${p.quantity})`).join("\n"),
      );
    }
  }, [products]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          payload,
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/products", payload);
        toast.success("Product added successfully");
      }

      setFormData({ name: "", category: "", quantity: "", price: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container-fluid px-4 py-5 mt-5 bg-light">
        {/* ===== Header ===== */}
        <div className="card shadow-lg border-0 mb-4">
          <div
            className="card-body text-white rounded"
            style={{
              background: "linear-gradient(135deg, #1d2671, #c33764)",
            }}
          >
            <h2 className="fw-bold mb-1">
              {editingProduct ? "✏️ Update Product" : "📦 Product Management"}
            </h2>
            <p className="mb-0 opacity-75">
              Manage inventory with real-time stock insights
            </p>
          </div>
        </div>

        {/* ===== Form ===== */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {[
                  { label: "Product Name", name: "name", type: "text" },
                  { label: "Category", name: "category", type: "text" },
                  { label: "Quantity", name: "quantity", type: "number" },
                  { label: "Price (₹)", name: "price", type: "number" },
                ].map((f) => (
                  <div className="col-md-6" key={f.name}>
                    <label className="form-label fw-semibold">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      required
                      min="0"
                    />
                  </div>
                ))}
              </div>

              <div className="text-end mt-4">
                {editingProduct && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({
                        name: "",
                        category: "",
                        quantity: "",
                        price: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button className="btn btn-primary btn-lg px-5">
                  {editingProduct ? "Update" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== Table ===== */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white fw-bold">
            🧾 Inventory Overview
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Total Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.quantity < 3
                            ? "bg-danger"
                            : p.quantity < 10
                              ? "bg-warning text-dark"
                              : "bg-success"
                        }`}
                      >
                        {p.quantity}
                      </span>
                    </td>
                    <td>₹{p.price}</td>
                    <td className="fw-semibold">
                      ₹{(p.price * p.quantity).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
