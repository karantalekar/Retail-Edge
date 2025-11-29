import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });
  const [products, setProducts] = useState([]); // all products
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // track editing

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Low stock alert (<3)
  useEffect(() => {
    if (products.length === 0) return;
    const veryLowStock = products.filter((p) => p.quantity < 3);
    if (veryLowStock.length > 0) {
      alert(
        `⚠️ Warning: The following products have very low stock!\n` +
          veryLowStock.map((p) => `${p.name} (Stock: ${p.quantity})`).join("\n")
      );
    }
  }, [products]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit new product
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
          payload
        );
        setMessage("✅ Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/products", payload);
        setMessage("✅ Product added successfully!");
      }

      setFormData({ name: "", category: "", quantity: "", price: "" });
      setEditingProduct(null);
      fetchProducts(); // refresh list to trigger low stock alert
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("❌ " + (error.response?.data?.message || error.message));
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setMessage("🗑️ Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting:", error);
      setMessage("❌ Error deleting product");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <div
        className="container py-5 mt-5"
        style={{ background: "linear-gradient(to right, #f9f9f9, #eef3ff)" }}
      >
        <div className="card shadow p-4 border-0">
          <h2 className="text-center mb-4 text-primary">
            {editingProduct ? "✏️ Update Product" : "🛒 Add New Product"}
          </h2>

          {message && (
            <div
              className={`alert ${
                message.startsWith("✅") || message.startsWith("🗑️")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="form-control"
                  min="0"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                  min="0"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  className="btn btn-secondary ms-3 px-4"
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
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div className="card mt-5 shadow border-0">
          <div className="card-header bg-primary text-white text-center fw-bold">
            📦 Product Inventory
          </div>
          <div className="card-body table-responsive">
            {products.length > 0 ? (
              <table className="table table-striped align-middle">
                <thead>
                  <tr className="table-primary">
                    <th>#</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price (₹)</th>
                    <th>Total Value (₹)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr key={p._id}>
                      <td>{index + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td
                        style={
                          p.quantity < 3
                            ? { color: "red", fontWeight: "bold" }
                            : {}
                        }
                      >
                        {p.quantity}
                      </td>
                      <td>{p.price}</td>
                      <td>{p.price * p.quantity}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(p)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted mb-0">No products found.</p>
            )}
          </div>
        </div>

        {/* Illustration */}
        <div className="text-center mt-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1055/1055646.png"
            alt="Add Product"
            width="100"
            className="img-fluid opacity-75"
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
