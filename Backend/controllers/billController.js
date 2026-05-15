import Bill from "../models/Bills.js";
import Product from "../models/Products.js";

// ─── Create Bill ───────────────────────────────────────────────────────────
export const createBill = async (req, res) => {
  try {
    const { customer, items, discount, taxRate } = req.body;

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    const newBill = new Bill({
      customer,
      items,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      total,
    });

    await newBill.save();

    // Deduct stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json({
      message: "Bill saved and stock updated successfully!",
      bill: newBill,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save bill", error });
  }
};

// ─── Get All Sales (Bills) ─────────────────────────────────────────────────
export const getSales = async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sales", error });
  }
};
