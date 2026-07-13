import React, { useEffect } from "react";
import { toast } from "react-toastify";
import api from "../config/api";

const LowStockAlert = () => {
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await api.get("/products/low-stock");

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
