import express from "express";
import {
  getStaff,
  approveStaff,
  deactivateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router = express.Router();

router.get("/", getStaff);
router.patch("/approve/:id", approveStaff);
router.patch("/deactivate/:id", deactivateStaff);
router.delete("/:id", deleteStaff);

export default router;
