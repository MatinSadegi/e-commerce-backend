import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  getUser,
  handleRefreshToken,
} from "../controller/userController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

//SignIn
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getUsers);
router.get("/refresh", handleRefreshToken);
router.get("/:id", protect, isAdmin, getUser);


export default router;
