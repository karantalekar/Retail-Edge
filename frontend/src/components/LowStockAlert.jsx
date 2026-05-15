import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LowStockAlert = () => {
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get(
          "https://retail-edge-6kx1.onrender.com/api/products/low-stock",
        );

        setLowStock(res.data);

        // 🔔 Show toast for each low stock item
        res.data.forEach((item) => {
          toast.warning(
            `⚠️ Low Stock: ${item.name} — Quantity: ${item.quantity}`,
            {
              autoClose: 5000, // 5 seconds
              pauseOnHover: true,
              closeOnClick: true,
            },
          );
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch low stock",
        );
      }
    };

    fetchLowStock();

    // Refresh every 60 seconds
    const interval = setInterval(fetchLowStock, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ No need for inline alert div
  return null;
};

export default LowStockAlert;
