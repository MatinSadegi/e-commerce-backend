import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new Error("Not authorized, no token");
  }
  try {
    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedData?.id);
    req.userId = user?._id;
    next();
  } catch (error) {
    throw new Error("Not Authorized token expired , Please Login again");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const adminUser = await User.findById({ user });
  if (adminUser.role !== "admin") {
    throw new Error("You are not admin");
  } else {
    next();
  }
});
