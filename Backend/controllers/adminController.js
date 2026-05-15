import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/Users.js";

// ─── Helper: Extract & Verify Token ─────────────────────────────────────────
const getAuthUser = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized: No token provided" };
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    throw { status: 401, message: "Unauthorized: Invalid token" };
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  if (user.role !== "admin") {
    throw { status: 403, message: "Access denied: Admins only" };
  }

  return user;
};

// ─── Get Current Admin ─────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const admin = await getAuthUser(req);

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        userToken: admin.userToken,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ─── Update Current Admin ──────────────────────────────────────────────────
export const updateMe = async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    const { fullname, email, password } = req.body;

    if (fullname) admin.fullname = fullname;
    if (email) admin.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        userToken: admin.userToken,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
