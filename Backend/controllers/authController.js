import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/Users.js";
import cookieParser from "cookie-parser";

// ─── Helpers ───────────────────────────────────────────────────────────────
const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(password);
};

// ─── Register ──────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number & special character",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with unique token
    const user = new User({
      fullname: fullName,
      email,
      password: hashedPassword,
      role: role?.toLowerCase() || "user",
      userToken: uuidv4(), // 🔥 unique token
    });

    await user.save();

    res.status(201).json({
      message: "Registration Successful!",
      userToken: user.userToken, // optional (send or hide based on use)
    });
  } catch (error) {
    console.error("Error saving User:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ─── Login
// export const login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     // const user = await User.findOne({ email });
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(400).json({ message: "Email not found." });
//     }

//     // Compare hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Incorrect password." });
//     }

//     // Role check (optional)
//     if (role && user.role !== role.toLowerCase()) {
//       return res.status(400).json({ message: "Role mismatch." });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_KEY || "secret123",
//       { expiresIn: "2h" },
//     );

//     res.status(200).json({
//       message: "Login successful!",
//       token,
//       user: {
//         id: user._id,
//         fullname: user.fullname,
//         email: user.email,
//         role: user.role,
//         userToken: user.userToken, // 🔥 include unique token
//       },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error: " + error.message });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Email not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    if (role && user.role !== role.toLowerCase()) {
      return res.status(400).json({ message: "Role mismatch." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "2h" },
    );

    // 🔥 SET COOKIE (MAIN CHANGE)
    res.cookie("token", token, {
      httpOnly: true, // cannot access from JS (secure)
      secure: false, // true in production (HTTPS)
      sameSite: "lax", // prevents CSRF basic protection
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful!",
      token, // 🔥 Include token in response for frontend storage
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
};

export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, adminKey } = req.body;

    //  Required fields check
    if (!fullName || !email || !password || !adminKey) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //  Email validation (basic)
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    //  Admin Key Check (use env if available)
    const ADMIN_KEY = process.env.ADMIN_KEY || "ADMIN123";

    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({
        message: "Invalid admin key",
      });
    }

    //  Password validation
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number & special character",
      });
    }

    //  Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create admin
    const admin = new User({
      fullname: fullName,
      email,
      password: hashedPassword,
      role: "admin",
      approved: true,
      userToken: uuidv4(),
    });

    await admin.save();

    //  Generate JWT token (auto-login after registration)
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_KEY,
      { expiresIn: "2h" },
    );

    res.status(201).json({
      message: "Admin registered successfully!",
      token, //  Return token for auto-login
      user: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Register Error:", error.message);
    res.status(500).json({
      message: "Server error: " + error.message,
    });
  }
};
