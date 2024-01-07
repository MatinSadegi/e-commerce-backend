import express from "express";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";
import { addToCart } from "../controller/cartController.js";
const router = express.Router();

router.post("/add-to-cart",protect, addToCart);


export default router;
