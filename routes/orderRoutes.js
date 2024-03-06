import express from "express";
import {
createOrder
} from "../controller/orderController.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.post("/",protect, createOrder);


export default router;
