import express from "express";
import { getMe, updateMe } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", getMe);
router.put("/", updateMe);

export default router;
