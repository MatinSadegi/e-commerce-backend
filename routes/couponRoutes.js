import express from "express";
import { applyCoupon, createCoupon, deleteCoupon, getAllCoupons, getCoupon} from "../controller/couponController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.get("/:id", getCoupon);
router.delete('/:id',deleteCoupon)
router.post('/apply-coupon',protect,applyCoupon)

export default router;
 