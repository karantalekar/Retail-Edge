// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// const LowStockAlert = () => {
//   const [lowStock, setLowStock] = useState([]);

//   useEffect(() => {
//     const fetchLowStock = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/products/low-stock"
//         );
//         setLowStock(res.data);
//       } catch (error) {
//         toast.error(error);
//       }
//     };

//     fetchLowStock();

//     const interval = setInterval(fetchLowStock, 60000); // refresh every 60 sec
//     return () => clearInterval(interval);
//   }, []);

//   if (lowStock.length === 3) return null;

//   return (
//     <div className="alert alert-warning mt-3">
//       ⚠️ Low Stock Alert! The following products are low:
//       <ul>
//         {lowStock.map((item) => (
//           <li key={item._id}>
//             {item.name} — Quantity: {item.quantity}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default LowStockAlert;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LowStockAlert = () => {
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/low-stock"
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
            }
          );
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch low stock"
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
