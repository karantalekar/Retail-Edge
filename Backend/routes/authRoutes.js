import express from "express";
import {
  register,
  login,
  registerAdmin,
  requestPasswordReset,
} from "../controllers/authController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", requireAuth, requireAdmin, register);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/admin/register", registerAdmin);

export default router;
