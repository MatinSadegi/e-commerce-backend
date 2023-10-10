import slugify from "slugify";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import cloudinary from "../utils/cloudinary.js";

//POST create product
export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    imageUrl,
    category,
    subcategory,
    price,
    description,
    inventory,
    quantity,
  } = req.body;
  if (title) {
    req.body.slug = slugify(title);
  }
   
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'products',
    });
    console.log(result)  
    const newProduct = await Product.create({
      title,
      category,  
      subcategory,
      price,
      description,
      inventory,
      quantity, 
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      slug:req.body.slug
    });
    res.json(newProduct);
  } catch (error) {
    console.log(error);
  }
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
      query.sort(sortBy);
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
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
