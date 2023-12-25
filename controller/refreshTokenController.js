import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt, { decode } from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { generateRefreshToken } from "../utils/refreshToken.js";
export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  const foundUser = await User.findOne({ refreshToken }).exec();
  //Detected refresh token reuse!
  if (!foundUser) return res.sendStatus(403); //Forbidden
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if ((err, foundUser.id !== decode.id)) return res.sendStatus(403);
    const accessToken = generateToken(foundUser?._id);
    // const newRefreshToken = generateRefreshToken(foundUser?._id);
    // foundUser.refreshToken = newRefreshToken
    // const result = await foundUser.save();
    res.cookie("accessToken", accessToken, { maxAge: 60000 });
  }); 
});
