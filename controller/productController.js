import slugify from "slugify";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

import cloudinary from "../utils/cloudinary.js";

//POST create product
export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    image,
    category,
    subcategory,
    price,
    description,
    inventory,
    quantity,
    brand,
    trending,
  } = req.body;
  if (title) {
    req.body.slug = slugify(title);
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "products",
    });

    const newProduct = await Product.create({
      title,
      category,
      subcategory,
      price,
      description,
      inventory,
      brand,
      quantity,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      slug: req.body.slug,
      trending,
    });
    res.json(newProduct);
  } catch (error) {
    console.log(error);
  }
});

//GET get all products
export const getProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const keys = Object.keys(queryObj);
  if (keys.length === 0) {
    const products = await Product.find();
    res.status(200).json(products);
  } else {
    let newObj = {};
    keys.map((item) => {
      if (item === "price") {
        newObj[item] = queryObj[item];
      } else if (item === "size") {
        newObj["quantity"] = queryObj[item].split(",");
      } else {
        newObj[item] = queryObj[item].split(",");
      }
    });

    keys.forEach((item) => {
      if (queryObj[item] === "") {
        delete newObj[item];
      }
    });
    //Filtering
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete newObj[el]);
    let queryStr = JSON.stringify(newObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQueries = JSON.parse(queryStr);

    let query = Product.find(parsedQueries);

    //Sorting
    if (req.query.sort === "cheapest") {
      query.sort("price");
    } else if (req.query.sort === "most expensive") {
      query.sort("-price");
    } else {
      query.sort("-createdAt");
    }

    const product = await query;
    res.status(200).json(product);
  }
});

//GET get product
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findOne({ slug: id });
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//DELETE delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // const findProduct = await Product.findOneAndDelete({slug:id});
    // res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
