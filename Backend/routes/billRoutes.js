import express from "express";
import { createBill, getSales } from "../controllers/billController.js";

const router = express.Router();

router.post("/bills", createBill);
router.get("/sales", getSales);

export default router;
