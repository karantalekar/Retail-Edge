import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import Product from "./models/Products.js";
import User from "./models/Users.js";
import Bill from "./models/Bills.js";

// env file configuration / database
dotenv.config();

//
const app = express();
const router = express.Router(); // router better than post/get .

// middleware using
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    console.log("Backend Data : ", req.body);

    const s = new User({
      fullname: fullName,
      email,
      password,
      role: role.toLowerCase(),
    });
    await s.save(); // insert one()
    res.status(200).json({ message: "Registration Success !! " });
  } catch (error) {
    console.error("Error saving User:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found." });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Optional: check role consistency
    if (role && user.role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(400).json({ message: "Role mismatch." });
    }

    //  Generate JWT with role
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, // 👈 this is critical
      },
      process.env.JWT_KEY || "secret123",
      { expiresIn: "2h" }
    );

    //  Send token + user info
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

app.post("/api/products", async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    console.log("Backend Data : ", req.body);

    const s = new Product({
      name,
      category,
      quantity,
      price,
    });
    await s.save(); // insert one()
    res.status(200).json({ message: "Product Added Success !! " });
  } catch (error) {
    console.error("Error adding product:", error.message);
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
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, quantity, price },
      { new: true } // return updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: " Product deleted successfully" });
  } catch (error) {
    console.error(" Delete error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/api/bills", async (req, res) => {
  try {
    const { customer, items, discount, taxRate } = req.body;

    // Calculate totals
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    // Create bill
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

    // Update stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }, // decrement stock
      });
    }

    res.status(201).json({
      message: "Bill saved and stock updated successfully!",
      bill: newBill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save bill", error });
  }
});

app.use(router);

// Fetch all bills (sales)
app.get("/api/sales", async (req, res) => {
  try {
    const bills = await Bill.find(); // get all bills
    res.status(200).json(bills);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Failed to fetch sales", error });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});
