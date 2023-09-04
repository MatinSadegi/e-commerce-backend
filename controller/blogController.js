import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongodbId.js";

export const createBlog = asyncHandler(async (req, res) => {
    const newBlog = await Blog.create(req.body)
    res.json(newBlog)
});
