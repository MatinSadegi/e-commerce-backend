import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import User from "../models/userModel.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { id, size, count } = req.body;
  const { _id } = req.userId;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    let products = [];
    const { price, title } = await Product.findById(id);
    const alreadyExistCart = await Cart.findOne({ orderby: _id });
    if (alreadyExistCart) {
      const cartTotal = alreadyExistCart.cartTotal;
      const alreadyExistProduct = await Cart.find({
        $and: [{ orderby: _id }, { "products.product": id }],
      });

      if (alreadyExistProduct.length) {
        await Cart.updateOne(
          { orderby: _id, "products.product": id },
          {
            $inc: { "products.$.count": count },
            $set: { cartTotal: cartTotal + price * count },
          }
        );
        res.json("the user cart has been updated");
      } else {
        await Cart.updateOne(
          { orderby: _id },
          {
            $push: { products: { product: id, count, size } },
            $set: { cartTotal: cartTotal + price * count },
          }
        );
        res.json(`${title} has been added to the user's cart`);
      }
    } else {
      products.push({ product: id, count, size });
      const newCart = await Cart.create({
        products,
        cartTotal: price * count,
        orderby: user?._id,
      });
      await User.updateOne({ _id }, { $set: { cart: newCart._id } });
      res.json("the product has been added to the user cart");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//GET get user cart
export const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.userId;
  const cart = await User.findById(_id).populate("cart");
  const populatedCart = await cart.cart.populate('products.product')
  res.json(populatedCart);
});
