import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import Product from "./models/Products.js";
import User from "./models/Users.js";
import Bill from "./models/Bills.js";

dotenv.config();

const app = express();
const router = express.Router();

// middleware
app.use(cors());
app.use(express.json());

// DB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 🔐 PASSWORD VALIDATION FUNCTION (ADDED)
const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(password);
};

// ================= Add Users =================
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    console.log("Backend Data : ", req.body);

    // ❌ Password validation ONLY (ADDED)
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number & special character",
      });
    }

    const s = new User({
      fullname: fullName,
      email,
      password,
      role: role.toLowerCase(),
    });

    await s.save();
    res.status(200).json({ message: "Registration Success !!" });
  } catch (error) {
    console.error("Error saving User:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found." });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    if (role && user.role !== role.toLowerCase()) {
      return res.status(400).json({ message: "Role mismatch." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_KEY || "secret123",
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ================= PRODUCTS =================

app.post("/api/products", async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;

    const s = new Product({ name, category, quantity, price });
    await s.save();
    res.status(200).json({ message: "Product Added Success !!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= BILLS =================

router.post("/api/bills", async (req, res) => {
  try {
    const { customer, items, discount, taxRate } = req.body;

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
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
});

app.use(router);

// ================= SALES =================

app.get("/api/sales", async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sales", error });
  }
});
// ================== Manage Admin ==============
// Get current admin
app.get("/api/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_KEY || "secret123");
    const admin = await User.findById(decoded.id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update current admin
app.put("/api/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_KEY || "secret123");
    const { fullname, email, password } = req.body;

    const admin = await User.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.fullname = fullname || admin.fullname;
    admin.email = email || admin.email;
    if (password) admin.password = password;

    await admin.save();
    res.json({ message: "Profile updated successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =============== Manage Staff ==============

// Get all staff
app.get("/api/staff", async (req, res) => {
  try {
    // Only return users with role "staff"
    const staff = await User.find({ role: "staff" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Activate staff
app.patch("/api/staff/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.approved = true;
    await staff.save();
    res.status(200).json({ message: "Staff approved", staff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deactivate staff
app.patch("/api/staff/deactivate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.approved = false;
    await staff.save();
    res.status(200).json({ message: "Staff deactivated", staff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete staff
app.delete("/api/staff/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findByIdAndDelete(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});
