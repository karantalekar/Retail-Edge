import express from "express";
import {
  getStaff,
  approveStaff,
  deactivateStaff,
  deleteStaff,
  resetStaffPassword,
} from "../controllers/staffController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", getStaff);
router.patch("/approve/:id", approveStaff);
router.patch("/deactivate/:id", deactivateStaff);
router.patch("/reset-password/:id", resetStaffPassword);
router.delete("/:id", deleteStaff);

export default router;
