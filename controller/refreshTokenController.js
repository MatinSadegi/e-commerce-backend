import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
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
  const foundUser = await User.findOne({ refreshToken });
  //Detected refresh token reuse!
  if (!foundUser) return res.sendStatus(403); //Forbidden
  jwt.verify(
    refreshToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decode) => {
      if (err | (foundUser._id.toString() !== decode.id)) {
        return res.sendStatus(403);
      } else {
        const accessToken = generateToken(foundUser?._id);
        const newRefreshToken = generateRefreshToken(foundUser?._id);
        foundUser.refreshToken = newRefreshToken;
        await foundUser.save();
        res.cookie("refreshToken", newRefreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: "Lax",
          secure: true,
        });
        res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: "Lax",
          secure: true,
        });
        res.send("new accessToken was created");
      }
    }
  );
});
