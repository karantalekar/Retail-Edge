import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaBoxOpen,
  FaBoxes,
  FaCheck,
  FaChevronDown,
  FaEdit,
  FaExclamationTriangle,
  FaMinus,
  FaPlus,
  FaRupeeSign,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import api from "../config/api";
import ConfirmDialog from "./ConfirmDialog";
import "../style/Inventory.css";

const emptyForm = { name: "", category: "", quantity: "", price: "" };
const LOW_STOCK_LIMIT = 5;
const DEFAULT_CATEGORIES = [
  "Electronics",
  "Furniture",
  "Office Supplies",
  "Stationery",
  "Clothing",
  "Home & Kitchen",
  "Sports",
  "Health & Medical",
  "Automotive",
  "Books",
  "Groceries",
  "Tools & Hardware",
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const InventorySelect = ({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!selectRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div
      className={`inventory-select ${open ? "open" : ""}`}
      ref={selectRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="inventory-select-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={selected ? "" : "placeholder"}>
          {selected?.label || placeholder}
        </span>
        <FaChevronDown />
      </button>
      <div className="inventory-select-menu" role="listbox">
        {options.map((option) => (
          <button
            type="button"
            role="option"
            aria-selected={option.value === value}
            className={option.value === value ? "selected" : ""}
            key={option.value}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            <span>{option.label}</span>
            {option.value === value && <FaCheck />}
          </button>
        ))}
      </div>
    </div>
  );
};

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const loadProducts = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.get("/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
      if (silent) toast.success("Inventory refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Unable to load inventory");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () =>
      [
        ...new Set([
          ...DEFAULT_CATEGORIES,
          ...products.map((product) => product.category).filter(Boolean),
        ]),
      ]
        .sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const metrics = useMemo(() => {
    const units = products.reduce(
      (total, product) => total + Number(product.quantity || 0),
      0,
    );
    const value = products.reduce(
      (total, product) =>
        total + Number(product.quantity || 0) * Number(product.price || 0),
      0,
    );
    const lowStock = products.filter(
      (product) => Number(product.quantity) < LOW_STOCK_LIMIT,
    ).length;

    return { units, value, lowStock };
  }, [products]);

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const quantity = Number(product.quantity || 0);
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query);
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "out" && quantity === 0) ||
        (stockFilter === "low" && quantity > 0 && quantity < LOW_STOCK_LIMIT) ||
        (stockFilter === "healthy" && quantity >= LOW_STOCK_LIMIT);

      return matchesSearch && matchesCategory && matchesStock;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "stock-asc") return Number(a.quantity) - Number(b.quantity);
      if (sortBy === "stock-desc") return Number(b.quantity) - Number(a.quantity);
      if (sortBy === "value-desc") {
        return Number(b.price) * Number(b.quantity) - Number(a.price) * Number(a.quantity);
      }
      return a.name.localeCompare(b.name);
    });
  }, [categoryFilter, products, searchTerm, sortBy, stockFilter]);

  const duplicateNameError = useMemo(() => {
    const normalizedName = formData.name.trim().toLowerCase();
    if (!normalizedName) return "";
    return products.some(
      (product) =>
        product.name?.trim().toLowerCase() === normalizedName &&
        product._id !== editingProduct?._id,
    )
      ? "A product with this name already exists."
      : "";
  }, [editingProduct, formData.name, products]);

  const formQuantity = Number(formData.quantity || 0);
  const formPrice = Number(formData.price || 0);
  const formReady =
    formData.name.trim().length >= 2 &&
    Boolean(formData.category) &&
    formData.quantity !== "" &&
    Number.isInteger(formQuantity) &&
    formQuantity >= 0 &&
    formData.price !== "" &&
    formPrice > 0 &&
    !duplicateNameError;
  const previewStatus =
    formQuantity === 0
      ? "Out of stock"
      : formQuantity < LOW_STOCK_LIMIT
        ? "Low stock"
        : "In stock";

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setEditorOpen(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: String(product.quantity),
      price: String(product.price),
    });
    setEditorOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formReady) {
      toast.error("Complete all product fields with valid values");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };

    setSaving(true);
    try {
      if (editingProduct) {
        const response = await api.put(`/products/${editingProduct._id}`, payload);
        const updated = response.data?.product || { ...editingProduct, ...payload };
        setProducts((current) =>
          current.map((product) =>
            product._id === editingProduct._id ? updated : product,
          ),
        );
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", payload);
        await loadProducts();
        toast.success("Product added successfully");
      }
      closeEditor();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const adjustStock = async (product, change) => {
    const quantity = Math.max(0, Number(product.quantity || 0) + change);
    if (quantity === Number(product.quantity)) return;

    setUpdatingId(product._id);
    try {
      const response = await api.put(`/products/${product._id}`, {
        name: product.name,
        category: product.category,
        price: Number(product.price),
        quantity,
      });
      const updated = response.data?.product || { ...product, quantity };
      setProducts((current) =>
        current.map((item) => (item._id === product._id ? updated : item)),
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to update stock");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (product) => {
    setUpdatingId(product._id);
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((current) =>
        current.filter((item) => item._id !== product._id),
      );
      toast.success("Product deleted");
      setProductToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete product");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStockFilter("all");
  };

  return (
    <div className="inventory-page">
      <Navbar />
      <main className="container-fluid px-3 px-lg-4 inventory-main">
        <header className="inventory-header">
          <div>
            <span className="inventory-eyebrow">STOCK CONTROL</span>
            <h1>Inventory</h1>
            <p>Monitor stock, manage products, and keep shelves ready for sale.</p>
          </div>
          <div className="inventory-header-actions">
            <button
              className="btn btn-outline-secondary"
              onClick={() => loadProducts(true)}
              disabled={refreshing}
            >
              <FaSyncAlt className={refreshing ? "inventory-spin" : ""} />
              Refresh
            </button>
            <button className="btn btn-primary" onClick={openNewProduct}>
              <FaPlus /> Add product
            </button>
          </div>
        </header>

        <section className="inventory-metrics">
          <article>
            <span className="inventory-metric-icon blue"><FaBoxOpen /></span>
            <div><p>Total products</p><strong>{products.length}</strong><small>Active SKUs</small></div>
          </article>
          <article>
            <span className="inventory-metric-icon teal"><FaBoxes /></span>
            <div><p>Units in stock</p><strong>{metrics.units.toLocaleString("en-IN")}</strong><small>Across all products</small></div>
          </article>
          <article>
            <span className="inventory-metric-icon purple"><FaRupeeSign /></span>
            <div><p>Inventory value</p><strong>{currency.format(metrics.value)}</strong><small>At current price</small></div>
          </article>
          <article>
            <span className="inventory-metric-icon amber"><FaExclamationTriangle /></span>
            <div><p>Needs attention</p><strong>{metrics.lowStock}</strong><small>Below {LOW_STOCK_LIMIT} units</small></div>
          </article>
        </section>

        <section className="inventory-panel">
          <div className="inventory-toolbar">
            <label className="inventory-search">
              <FaSearch />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products or categories"
              />
            </label>
            <InventorySelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              ariaLabel="Filter by category"
              options={[
                { value: "all", label: "All categories" },
                ...categories.map((category) => ({ value: category, label: category })),
              ]}
            />
            <InventorySelect
              value={stockFilter}
              onChange={setStockFilter}
              ariaLabel="Filter by stock status"
              options={[
                { value: "all", label: "All stock levels" },
                { value: "healthy", label: "In stock" },
                { value: "low", label: "Low stock" },
                { value: "out", label: "Out of stock" },
              ]}
            />
            <InventorySelect
              value={sortBy}
              onChange={setSortBy}
              ariaLabel="Sort inventory"
              options={[
                { value: "name-asc", label: "Name: A to Z" },
                { value: "name-desc", label: "Name: Z to A" },
                { value: "stock-asc", label: "Stock: low to high" },
                { value: "stock-desc", label: "Stock: high to low" },
                { value: "value-desc", label: "Highest value" },
              ]}
            />
          </div>

          <div className="inventory-panel-heading">
            <div>
              <h2>Product inventory</h2>
              <p>{visibleProducts.length} of {products.length} products</p>
            </div>
          </div>

          {loading ? (
            <div className="inventory-loading">
              <div className="spinner-border text-primary" role="status" />
              <span>Loading inventory…</span>
            </div>
          ) : visibleProducts.length ? (
            <div className="table-responsive">
              <table className="table inventory-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock status</th>
                    <th>Quantity</th>
                    <th>Unit price</th>
                    <th>Total value</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => {
                    const quantity = Number(product.quantity || 0);
                    const status = quantity === 0 ? "out" : quantity < LOW_STOCK_LIMIT ? "low" : "healthy";
                    const busy = updatingId === product._id;
                    return (
                      <tr key={product._id}>
                        <td><strong>{product.name}</strong></td>
                        <td><span className="inventory-category">{product.category}</span></td>
                        <td><span className={`stock-badge ${status}`}>{status === "out" ? "Out of stock" : status === "low" ? "Low stock" : "In stock"}</span></td>
                        <td>
                          <div className="stock-stepper">
                            <button onClick={() => adjustStock(product, -1)} disabled={busy || quantity === 0} aria-label={`Reduce ${product.name} stock`}><FaMinus /></button>
                            <strong>{quantity}</strong>
                            <button onClick={() => adjustStock(product, 1)} disabled={busy} aria-label={`Increase ${product.name} stock`}><FaPlus /></button>
                          </div>
                        </td>
                        <td>{currency.format(Number(product.price || 0))}</td>
                        <td className="inventory-value">{currency.format(Number(product.price || 0) * quantity)}</td>
                        <td>
                          <div className="inventory-row-actions">
                            <button className="inventory-icon-button edit" onClick={() => openEditProduct(product)} disabled={busy} aria-label={`Edit ${product.name}`} title="Edit product"><FaEdit /></button>
                            <button className="inventory-icon-button delete" onClick={() => setProductToDelete(product)} disabled={busy} aria-label={`Delete ${product.name}`} title="Delete product"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="inventory-empty">
              <FaBoxOpen />
              <strong>No products found</strong>
              <span>Try changing the filters or add a new product.</span>
              {(searchTerm || categoryFilter !== "all" || stockFilter !== "all") && (
                <button className="btn btn-outline-primary btn-sm" onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          )}
        </section>
      </main>

      {editorOpen && (
        <div className="inventory-editor-backdrop" onMouseDown={closeEditor}>
          <aside className="inventory-editor" onMouseDown={(event) => event.stopPropagation()} aria-label={editingProduct ? "Edit product" : "Add product"}>
            <div className="inventory-editor-heading">
              <div>
                <span>{editingProduct ? "EDIT PRODUCT" : "NEW PRODUCT"}</span>
                <h2>{editingProduct ? "Update product" : "Add to inventory"}</h2>
                <p>Enter accurate product and stock information.</p>
              </div>
              <button onClick={closeEditor} aria-label="Close product editor"><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <section className="inventory-form-section">
                <div className="inventory-form-section-title">
                  <span>1</span>
                  <div><strong>Product details</strong><small>Identify and organize this item.</small></div>
                </div>
                <label>
                  <span className="inventory-label-row"><span>Product name</span><small>{formData.name.length}/80</small></span>
                  <input className={`form-control ${duplicateNameError ? "is-invalid" : ""}`} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Premium Basmati Rice" minLength="2" maxLength="80" required autoFocus />
                  {duplicateNameError ? <small className="text-danger">{duplicateNameError}</small> : <small className="inventory-field-hint">Use the name shown on the shelf or invoice.</small>}
                </label>
                <div className="inventory-form-field">
                  <span>Category</span>
                  <InventorySelect
                    value={formData.category}
                    onChange={(category) => setFormData((current) => ({ ...current, category }))}
                    placeholder="Select a category"
                    ariaLabel="Product category"
                    options={categories.map((category) => ({ value: category, label: category }))}
                  />
                </div>
              </section>

              <section className="inventory-form-section">
                <div className="inventory-form-section-title">
                  <span>2</span>
                  <div><strong>Stock and pricing</strong><small>Set opening quantity and selling price.</small></div>
                </div>
                <label>
                  <span>Opening quantity</span>
                  <div className="inventory-quantity-control">
                    <button type="button" onClick={() => setFormData((current) => ({ ...current, quantity: String(Math.max(0, Number(current.quantity || 0) - 1)) }))} disabled={formQuantity <= 0} aria-label="Reduce opening quantity"><FaMinus /></button>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" step="1" placeholder="0" required />
                    <button type="button" onClick={() => setFormData((current) => ({ ...current, quantity: String(Number(current.quantity || 0) + 1) }))} aria-label="Increase opening quantity"><FaPlus /></button>
                  </div>
                  <div className="inventory-quantity-presets">
                    {[0, 5, 10, 25, 50].map((quantity) => <button type="button" key={quantity} className={formQuantity === quantity && formData.quantity !== "" ? "active" : ""} onClick={() => setFormData((current) => ({ ...current, quantity: String(quantity) }))}>{quantity}</button>)}
                  </div>
                </label>
                <label>
                  <span>Unit selling price</span>
                  <div className="inventory-price-input"><span>₹</span><input className="form-control" type="number" name="price" value={formData.price} onChange={handleChange} min="0.01" step="0.01" placeholder="0.00" required /></div>
                  <small className="inventory-field-hint">Enter the customer-facing price per unit.</small>
                </label>
              </section>

              <section className="inventory-form-preview">
                <div><span>Opening inventory value</span><strong>{currency.format(formQuantity * formPrice)}</strong></div>
                <span className={`stock-badge ${formQuantity === 0 ? "out" : formQuantity < LOW_STOCK_LIMIT ? "low" : "healthy"}`}>{previewStatus}</span>
              </section>
              <div className="inventory-editor-actions">
                <button type="button" className="btn btn-outline-secondary" onClick={closeEditor}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || !formReady}>{saving ? "Saving…" : editingProduct ? "Save changes" : "Add to inventory"}</button>
              </div>
            </form>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(productToDelete)}
        variant="danger"
        title="Delete product?"
        description={productToDelete ? `${productToDelete.name} will be permanently removed from inventory. This action cannot be undone.` : ""}
        confirmLabel="Delete product"
        busyLabel="Deleting…"
        busy={Boolean(productToDelete && updatingId === productToDelete._id)}
        onConfirm={() => handleDelete(productToDelete)}
        onClose={() => setProductToDelete(null)}
      >
        {productToDelete && <div className="confirm-dialog-details"><div><span>Category</span><strong>{productToDelete.category}</strong></div><div><span>Current stock</span><strong>{productToDelete.quantity} units</strong></div></div>}
      </ConfirmDialog>
    </div>
  );
};

export default AddProduct;
