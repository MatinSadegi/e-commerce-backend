import slugify from "slugify";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

import cloudinary from "../utils/cloudinary.js";

//POST create product
export const createProduct = asyncHandler(async (req, res) => {
  console.log(req.body)
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
    trending
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
      trending
    });
    res.json(newProduct);
  } catch (error) { 
    console.log(error);
  }   
});  



//GET get all products
export const getProducts = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    let prods = await Product.find();
    res.json(prods); 

    //Filtering 

    // const excludeFields = ["page", "sort", "limit", "fields"];
    // excludeFields.forEach((el) => delete queryObj[el]);
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // let query = Product.find(JSON.parse(queryStr));

    // //Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // //limiting the fields
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // //pagination
    // const page = req.query.page;
    // const limit = req.query.limit;
    // const skip = (page - 1) * limit;
    // if (req.query.page) {
    //   const productCount = await Product.countDocuments();
    //   if (skip >= productCount) throw new Error("This Page does not exists");
    // }
    // const product = await query;
    // res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

//GET get product
export const getProduct = asyncHandler(async (req, res) => {
  const {id} = req.params
  try {
    const findProduct = await Product.findOne({slug:id});
    res.json(findProduct);
  } catch (error) {
    throw new Error(error); 
  }
});

//DELETE delete product
export const deleteProduct = asyncHandler(async(req,res) =>{
   const { id } = req.params;
   console.log(req.params)
  try {
    // const findProduct = await Product.findOneAndDelete({slug:id});
    // res.json(findProduct);
  } catch (error) {
    throw new Error(error)}

})
