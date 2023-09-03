import express from "express";
import {
  createProduct,
  getProduct,
  getProducts,
} from "../controller/productController.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", createProduct);
router.get(":id", getProduct);
router.get("/", getProducts);

export default router;
  