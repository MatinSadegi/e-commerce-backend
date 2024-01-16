import express from "express";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";
import { addToCart, getCart, removeFromCart } from "../controller/cartController.js";
const router = express.Router();

router.get("/", protect, getCart);
router.post("/add-to-cart", protect, addToCart);
router.post('/remove',protect, removeFromCart)

export default router;
