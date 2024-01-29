import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
} from "../controller/productController.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", createProduct);
router.get("/",getProducts);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

export default router;
