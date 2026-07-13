import express from "express";
import { createBill, getSales } from "../controllers/billController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/bills", requireAuth, createBill);
router.get("/sales", getSales);

export default router;
