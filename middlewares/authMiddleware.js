import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).send({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decodedData = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedData?.id);
    req.userId = user?._id;
    next();
  } catch (error) {
    throw new Error("Not Authorized token expired , Please Login again");
  }
});
export const checkUser = asyncHandler(async (req, res, next) => {
  let user;
  if (req.cookies.accessToken) {
    const decodedData = jwt.verify(
      req.cookies.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (decodedData) {
      user = await User.findById(decodedData?.id);
      req.userId = user?._id;
    }
  }
  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const adminUser = await User.findById({ user });
  if (adminUser.role !== "ADMIN") {
    throw new Error("You are not admin");
  } else {
    next();
  }
});
