import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import { generateRefreshToken } from "../utils/refreshToken.js";

//POST create user
export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    // return res.status(400).json({ msg: "User Already Exists", success: false });
    throw new Error("User Already Exists");
  }
  const hashedPassword = bcrypt.hashSync(password, 12);
  await User.create({
    firstName,
    lastName,
    phoneNumber,
    email,
    password: hashedPassword,
  });
  res.status(200).json({ message: "Account created" });
});

//POST login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    throw new Error("User Not Found");
  }
  const validPassword = await bcrypt.compare(password, findUser.password);
  if (!validPassword) {
    throw new Error("invalid password");
  }
  const refreshToken = generateRefreshToken(findUser?._id);
  const updateUser = await User.findByIdAndUpdate(
    findUser.id,
    {
      refreshToken,
    },
    { new: true }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  res.status(200).json({
    msg: "Login success",
    data: {
      id: findUser._id,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email: findUser.email,
      phoneNumber: findUser.phoneNumber,
      token: generateToken(findUser._id),
    },
  });
});

//GET handle refresh token
export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//GET logout
export const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken",{httpOnly:true, secure:true});
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken,{refreshToken:""})
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

//GET get all users
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

//GET get a user
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

