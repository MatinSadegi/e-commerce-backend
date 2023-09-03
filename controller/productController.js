import slugify from "slugify";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongodbId.js";

//POST create product
export const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  res.json(newProduct);
});

//GET get product
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//GET get all products
export const getProducts = asyncHandler(async (req, res) => {
  try {
    //Filtering
    const queryObj = req.query;
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy)
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination

  } catch (error) {
    throw new Error(error)
  }
});
