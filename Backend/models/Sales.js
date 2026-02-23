import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Add staff
  customer: {
    name: String,
    email: String,
    phone: String,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      productName: String,
      price: Number,
      quantity: Number,
    },
  ],
  discount: Number,
  taxRate: Number,
  subtotal: Number,
  discountAmount: Number,
  taxAmount: Number,
  total: Number,
  date: Date,
});

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;
