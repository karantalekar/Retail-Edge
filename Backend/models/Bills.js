import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: false },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // price per unit
        total: { type: Number, required: true }, // quantity * price
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.18 }, // 18% GST
    taxAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    // optional fields:
    paymentMethod: { type: String, default: "cash" }, // cash, card, UPI, etc.
    notes: { type: String, default: "" },
  },
  { versionKey: false }
);

// module.exports = mongoose.model("Bills", BillSchema);

const Bills = mongoose.model("Bills", BillSchema);

export default Bills;
