import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  getUser,
  logout,
  getUserProfile,
} from "../controller/userController.js";
import { handleRefreshToken } from "../controller/refreshTokenController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

//SignIn
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getUsers);
router.get("/refresh", handleRefreshToken);
router.get("logout", logout);
router.get("/profile",protect, getUserProfile);
router.get("/:id", protect, isAdmin, getUser);

export default router;
 