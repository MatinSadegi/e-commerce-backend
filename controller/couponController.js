import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import Coupon from "../models/couponModel.js";

export const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// const applyCoupon = asyncHandler(async (req, res) => {
//   const { coupon } = req.body;
// });
