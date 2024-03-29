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

export const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

export const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json(deleteCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const _id = req.userId;
  const validCoupon = await Coupon.findOne({ name: coupon });

  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  let { cartTotal } = await Cart.findOne({ orderby: _id });
  let discount = (cartTotal * validCoupon.discount) / 100;
  await Cart.findOneAndUpdate({ orderby: _id }, { discount }, { new: true });
  res.json({
    discount,
  });
});
