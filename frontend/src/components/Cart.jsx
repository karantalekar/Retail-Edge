import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCheck,
  FaMinus,
  FaPlus,
  FaSearch,
  FaShoppingBasket,
  FaSyncAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import StaffNavbar from "./StaffNavbar";
import api from "../config/api";
import "../style/StaffWorkspace.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const Cart = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const billingCustomer = state?.customer;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => state?.cart || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const response = await api.get("/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
      if (silent) toast.success("Inventory refreshed");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load inventory");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return products
      .filter((product) => category === "All" || product.category === category)
      .filter(
        (product) =>
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm, category]);

  const cartUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountRate = subtotal < 1000 ? 0.1 : 0.15;
  const estimatedDiscount = subtotal * discountRate;

  const selectedQuantity = (product) =>
    Math.min(quantities[product._id] || 1, Math.max(product.quantity, 1));

  const changeProductQuantity = (product, difference) => {
    setQuantities((current) => ({
      ...current,
      [product._id]: Math.min(
        Math.max((current[product._id] || 1) + difference, 1),
        Math.max(product.quantity, 1),
      ),
    }));
  };

  const addToCart = (product) => {
    if (product.quantity <= 0) return;
    const requested = selectedQuantity(product);
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      const currentQuantity = existing?.quantity || 0;
      const nextQuantity = Math.min(currentQuantity + requested, product.quantity);
      if (nextQuantity === currentQuantity) {
        toast.info("All available units are already in the cart");
        return current;
      }
      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, quantity: nextQuantity } : item,
        );
      }
      return [
        ...current,
        { ...product, availableQuantity: product.quantity, quantity: nextQuantity },
      ];
    });
    setQuantities((current) => ({ ...current, [product._id]: 1 }));
  };

  const updateCartQuantity = (item, difference) => {
    setCart((current) =>
      current
        .map((entry) =>
          entry._id === item._id
            ? {
                ...entry,
                quantity: Math.min(
                  Math.max(entry.quantity + difference, 0),
                  item.availableQuantity,
                ),
              }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item._id !== id));
  };

  const reviewBill = () => {
    if (!cart.length) return;
    navigate("/Generatebill", { state: { cart, customer: billingCustomer } });
  };

  return (
    <div className="staff-workspace">
      <StaffNavbar />
      <main className="staff-shell">
        <header className="staff-page-header">
          <div>
            <span className="staff-eyebrow">SALES WORKSPACE</span>
            <h1>Inventory</h1>
            <p>Find products, confirm availability, and build a customer order.</p>
          </div>
          <div className="staff-header-actions">
            <button
              className="staff-secondary-button"
              onClick={() => fetchProducts(true)}
              disabled={refreshing}
            >
              <FaSyncAlt className={refreshing ? "staff-refresh-spin" : ""} />
              Refresh stock
            </button>
            <button className="staff-cart-toggle" onClick={() => setCartOpen(true)}>
              <FaShoppingBasket /> Cart <span>{cartUnits}</span>
            </button>
          </div>
        </header>

        <section className="staff-overview" aria-label="Inventory overview">
          <article><span>Products available</span><strong>{products.filter((item) => item.quantity > 0).length}</strong><small>Ready to sell</small></article>
          <article><span>Units in stock</span><strong>{products.reduce((sum, item) => sum + Math.max(item.quantity || 0, 0), 0)}</strong><small>Across all categories</small></article>
          <article><span>Current order</span><strong>{cartUnits}</strong><small>{money.format(subtotal)}</small></article>
        </section>

        <div className="staff-sales-layout">
          <section className="staff-catalog">
            <div className="staff-catalog-toolbar">
              <label className="staff-product-search">
                <FaSearch />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products or categories"
                />
                {searchTerm && <button onClick={() => setSearchTerm("")} aria-label="Clear search"><FaTimes /></button>}
              </label>
              <span>{filteredProducts.length} products</span>
            </div>

            <div className="staff-category-tabs" role="tablist" aria-label="Product categories">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                  role="tab"
                  aria-selected={category === item}
                >
                  {item}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="staff-product-grid">
                {[1, 2, 3, 4, 5, 6].map((item) => <div className="staff-product-skeleton" key={item} />)}
              </div>
            ) : filteredProducts.length ? (
              <div className="staff-product-grid">
                {filteredProducts.map((product) => {
                  const outOfStock = product.quantity <= 0;
                  const lowStock = product.quantity > 0 && product.quantity <= 10;
                  return (
                    <article className={`staff-product-card ${outOfStock ? "unavailable" : ""}`} key={product._id}>
                      <div className="staff-product-topline">
                        <span className="staff-product-visual"><FaBoxOpen /></span>
                        <span className={`staff-stock-label ${outOfStock ? "out" : lowStock ? "low" : "ready"}`}>
                          {outOfStock ? "Out of stock" : lowStock ? `${product.quantity} left` : "In stock"}
                        </span>
                      </div>
                      <div className="staff-product-copy">
                        <small>{product.category}</small>
                        <h2>{product.name}</h2>
                        <div><strong>{money.format(product.price)}</strong><span>per unit</span></div>
                      </div>
                      <div className="staff-product-actions">
                        <div className="staff-quantity-stepper">
                          <button onClick={() => changeProductQuantity(product, -1)} disabled={outOfStock || selectedQuantity(product) <= 1}><FaMinus /></button>
                          <span>{outOfStock ? 0 : selectedQuantity(product)}</span>
                          <button onClick={() => changeProductQuantity(product, 1)} disabled={outOfStock || selectedQuantity(product) >= product.quantity}><FaPlus /></button>
                        </div>
                        <button className="staff-add-button" onClick={() => addToCart(product)} disabled={outOfStock}>
                          {outOfStock ? "Unavailable" : <><FaPlus /> Add</>}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="staff-empty-state"><FaSearch /><h2>No matching products</h2><p>Try another search or category.</p><button onClick={() => { setSearchTerm(""); setCategory("All"); }}>Clear filters</button></div>
            )}
          </section>

          {cartOpen && <button className="staff-cart-backdrop" onClick={() => setCartOpen(false)} aria-label="Close cart" />}
          <aside className={`staff-cart-panel ${cartOpen ? "open" : ""}`}>
            <div className="staff-cart-heading">
              <div><span>ACTIVE ORDER</span><h2>Customer cart</h2></div>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart"><FaTimes /></button>
            </div>
            {cart.length ? (
              <>
                <div className="staff-cart-items">
                  {cart.map((item) => (
                    <article key={item._id}>
                      <span className="staff-cart-item-visual">{item.name.charAt(0).toUpperCase()}</span>
                      <div className="staff-cart-item-copy">
                        <strong>{item.name}</strong>
                        <small>{money.format(item.price)} each</small>
                        <div className="staff-cart-item-controls">
                          <button onClick={() => updateCartQuantity(item, -1)}><FaMinus /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item, 1)} disabled={item.quantity >= item.availableQuantity}><FaPlus /></button>
                        </div>
                      </div>
                      <div className="staff-cart-item-total"><strong>{money.format(item.price * item.quantity)}</strong><button onClick={() => removeFromCart(item._id)} aria-label={`Remove ${item.name}`}><FaTrash /></button></div>
                    </article>
                  ))}
                </div>
                <div className="staff-cart-summary">
                  <div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div>
                  <div className="discount"><span><FaCheck /> Auto discount ({discountRate * 100}%)</span><strong>-{money.format(estimatedDiscount)}</strong></div>
                  <small>GST and the final total are calculated on the billing screen.</small>
                  <button onClick={reviewBill}>Review bill <FaArrowRight /></button>
                </div>
              </>
            ) : (
              <div className="staff-cart-empty"><span><FaShoppingBasket /></span><h3>Your cart is ready</h3><p>Add products from the inventory to begin an order.</p></div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;
