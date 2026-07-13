import Bill from "../models/Bills.js";
import Product from "../models/Products.js";

// ─── Create Bill ───────────────────────────────────────────────────────────
export const createBill = async (req, res) => {
  try {
    const { customer, items, taxRate = 0.18 } = req.body;

    const customerName = customer?.name?.trim() || "";
    const customerMobile = customer?.mobile?.trim() || "";
    const customerEmail = customer?.email?.trim() || "";
    if (
      customerName.length < 2 ||
      customerName.length > 60 ||
      !/^[\p{L}\s.'-]+$/u.test(customerName)
    ) {
      return res.status(400).json({ message: "Enter a valid customer name" });
    }
    if (!/^[6-9]\d{9}$/.test(customerMobile)) {
      return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
    }
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customerEmail)) {
      return res.status(400).json({ message: "Enter a valid customer email address" });
    }
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Add at least one item to the bill" });
    }

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const discountRate = subtotal < 1000 ? 0.1 : 0.15;
    const discount = subtotal * discountRate;
    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    const newBill = new Bill({
      customer: {
        name: customerName,
        mobile: customerMobile,
        email: customerEmail,
      },
      staff: {
        userId: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
      },
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
