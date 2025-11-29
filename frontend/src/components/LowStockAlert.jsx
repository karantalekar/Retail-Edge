import React, { useEffect, useState } from "react";
import axios from "axios";

const LowStockAlert = () => {
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/low-stock"
        );
        setLowStock(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLowStock();

    const interval = setInterval(fetchLowStock, 60000); // refresh every 60 sec
    return () => clearInterval(interval);
  }, []);

  if (lowStock.length === 3) return null;

  return (
    <div className="alert alert-warning mt-3">
      ⚠️ Low Stock Alert! The following products are low:
      <ul>
        {lowStock.map((item) => (
          <li key={item._id}>
            {item.name} — Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlert;
