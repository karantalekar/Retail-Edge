import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import { globalLimiter } from "./middleware/rateLimit/globalLimiter.js";
dotenv.config();

const app = express();

//  Middleware
app.use(
  cors({
    origin: "https://retail-edge-sepia.vercel.app", // your frontend
    credentials: true,
  }),
);

app.options("*", cors());

// Apply globally
app.use(globalLimiter);
app.use(express.json());
app.use(cookieParser());

//  Connect DB
connectDB();

//  Routes
app.get("/", (req, res) => {
  res.send("Back End Running Successfully.");
});

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api", billRoutes);
app.use("/api/me", adminRoutes);
app.use("/api/staff", staffRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
