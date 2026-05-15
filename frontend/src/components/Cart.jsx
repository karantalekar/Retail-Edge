import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StaffNavbar from "./StaffNavbar";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://retail-edge-6kx1.onrender.com/api/products",
        );
        setProducts(res.data);
      } catch (error) {
        toast.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    setQuantities({ ...quantities, [product._id]: 1 });
  };

  const removeFromCart = (id) =>
    setCart(cart.filter((item) => item._id !== id));

  const updateCartQuantity = (id, quantity) =>
    setCart(
      cart.map((item) => (item._id === id ? { ...item, quantity } : item)),
    );

  const handleQuantityChange = (id, value) => {
    if (value < 1) return;
    setQuantities({ ...quantities, [id]: parseInt(value) });
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Navbar FIXED AT TOP */}
      <StaffNavbar />

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold">
            🧾 Retail Edge Billing System
          </h2>

          {/* Cart Icon */}
          <button
            className="btn btn-primary position-relative"
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="input-group mb-4 w-75 mx-auto">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Search by product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="row">
          {/* Product List */}
          <div className="col-md-8">
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div className="col-md-4 mb-4" key={product._id}>
                    <div className="card shadow-sm border-0 h-100 text-center p-3">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                        alt="product"
                        style={{ height: "120px", objectFit: "contain" }}
                      />
                      <h6 className="fw-bold mt-2">{product.name}</h6>
                      <p className="text-muted">Category: {product.category}</p>
                      <p className="fw-bold text-success">₹{product.price}</p>

                      <input
                        type="number"
                        className="form-control text-center mb-2"
                        style={{ width: "80px", margin: "0 auto" }}
                        value={quantities[product._id] || 1}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                      />

                      <button
                        className="btn btn-sm btn-primary w-100"
                        onClick={() => addToCart(product)}
                      >
                        ➕ Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No products found</p>
              )}
            </div>
          </div>

          {/* Cart Panel */}
          {showCart && (
            <div className="col-md-4">
              <div className="card shadow border-0">
                <div className="card-header bg-primary text-white text-center fw-bold">
                  🛒 Your Cart
                </div>

                <div className="card-body">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div
                        key={item._id}
                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                      >
                        <div>
                          <strong>{item.name}</strong>
                          <p className="text-muted small mb-0">
                            ₹{item.price} ×
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              style={{ width: "50px" }}
                              onChange={(e) =>
                                updateCartQuantity(
                                  item._id,
                                  parseInt(e.target.value),
                                )
                              }
                            />
                          </p>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item._id)}
                        >
                          ❌
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted">Your cart is empty</p>
                  )}

                  <hr />
                  <h5 className="text-end fw-bold text-success">
                    Total: ₹{totalAmount}
                  </h5>

                  {cart.length > 0 && (
                    <button
                      className="btn btn-success w-100 mt-2"
                      onClick={() =>
                        navigate("/Generatebill", { state: { cart } })
                      }
                    >
                      💵 Generate Bill
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
