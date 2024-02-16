import express from "express";
import { createCoupon } from "../controller/couponController.js";

const router = express.Router();

router.post("/", createCoupon);

export default router;
