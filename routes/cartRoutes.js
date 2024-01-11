import express from "express";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";
import { addToCart, getCart } from "../controller/cartController.js";
const router = express.Router();

router.get("/", protect, getCart);
router.post("/add-to-cart", protect, addToCart);

export default router;
