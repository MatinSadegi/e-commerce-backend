import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import User from "../models/userModel.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { id, size, count } = req.body;
  const { price, title, image } = await Product.findById(id);
  const user = req.userId;
  req.session.cookie.sameSite= 'none'
  let quantity = 0;
  if (!user) {
    if (req.session.cart) {
      for (let i = 0; i < req.session.cart.products.length; i++) {
        if (
          req.session.cart.products[i].productId === id &&
          req.session.cart.products[i].size === size
        ) {
          req.session.cart.products[i].count += count;
          req.session.cart.cartTotal += count * price;
          req.session.cart.countTotal += count;
          quantity++;
        }
      }
      if (quantity === 0) {
        req.session.cart.products.push({
          productId: id,
          size,
          count,
          image,
          title,
          price,
        });
        req.session.cart.cartTotal += count * price;
        req.session.cart.countTotal += count;
      }
    } else {
      req.session.cart = {
        products: [{ productId: id, size, count, image, title, price }],
        cartTotal: count * price,
        countTotal: count,
      };
    }
    res.status(200).json(req.session.cart.cartTotal);
  } else {
    try {
      const alreadyExistCart = await Cart.findOne({ orderby: user });
      if (alreadyExistCart) {
        for (let i = 0; i < alreadyExistCart.products.length; i++) {
          if (
            alreadyExistCart.products[i].productId.toString() === id &&
            alreadyExistCart.products[i].size === size
          ) {
            await Cart.updateOne(
              {
                $and: [
                  {
                    orderby: user,
                    "products.productId":
                      alreadyExistCart.products[i].productId,
                  },
                ],
              },
              {
                $inc: {
                  "products.$.count": count,
                  countTotal: count,
                  cartTotal: price * count,
                },
              }
            );
            quantity++;
          }
        }
        if (quantity === 0) {
          await Cart.updateOne(
            { orderby: user },
            {
              $push: {
                products: { productId: id, count, size, title, image, price },
              },
              $inc: { cartTotal: price * count, countTotal: count },
            }
          );
        }
      } else {
        const newCart = await Cart.create({
          products: { productId: id, count, size, title, image, price },
          cartTotal: price * count,
          countTotal: count,
          orderby: user,
        });
        await User.updateOne({ _id: user }, { $set: { cart: newCart._id } });
      }
      res.status(201).send(`${title} added to carts`);
    } catch (error) {
      throw new Error(error);
    }
  }
});

//GET get user cart
export const getCart = asyncHandler(async (req, res) => {
  const user = req.userId;
  console.log(req.session)
  try {
    if (!user) {
      const sessionCart = req.session.cart;
      console.log(sessionCart)
      if (sessionCart) {
        res.status(201).json({
          products: sessionCart.products,
          cartTotal: sessionCart.cartTotal,
          countTotal: sessionCart.countTotal,
        });
      } else {
        res.status(201).send("no product in cart");
      }
    } else {
      const cart = await User.findById(user).populate("cart");
      if (!cart) {
        res.status(201).send("no product in cart");
      } else {
        const populatedCart = cart.cart;
        res.json(populatedCart);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

//POST remove product from  cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { id, size, count } = req.body;
  const user = req.userId;
  const { price } = await Product.findById(id);
  if (!user) {
    let newSessionCart = req.session.cart.products.filter(
      (item) => !(item.productId === id && item.size === size)
    );
    const currentProduct = req.session.cart.products.filter(
      (item) => item.productId === id && item.size === size
    );
    if (currentProduct[0].count === count) {
      req.session.cart = {
        products: newSessionCart,
        countTotal: req.session.cart.countTotal - count,
        cartTotal: req.session.cart.cartTotal - count * price,
      };
    } else {
      if (currentProduct[0].count > 1) {
        const productAfterDecrement = {
          ...currentProduct[0],
          count: currentProduct[0].count - count,
        };
        const products = [...newSessionCart, productAfterDecrement];
        req.session.cart = {
          products: products,
          countTotal: req.session.cart.countTotal - count,
          cartTotal: req.session.cart.cartTotal - count * price,
        };
      }
    }

    // if (!newSessionCart.length) {
    //   req.session.destroy()
    // } else {
    //   req.session.cart = {
    //     products: newSessionCart,
    //     countTotal: req.session.cart.countTotal - count,
    //     cartTotal: req.session.cart.cartTotal - count * price,
    //   };
    // }
    res.status(200).send("The product was removed from the cart");
  } else {
    const cart = await Cart.findOne({ orderby: user });
    const currentProduct = cart.products.filter(
      (item) => item.productId.toString() === id && item.size === size
    )[0];
    try {
      if (currentProduct.count === count) {
        await Cart.updateOne(
          {
            $and: [
              {
                orderby: user,
                "products.productId": id,
                "products.size": size,
              },
            ],
          },
          {
            $inc: {
              countTotal: -count,
              cartTotal: -(price * count),
            },
            $pull: { products: currentProduct },
          }
        );
      } else {
        await Cart.updateOne(
          {
            $and: [
              {
                orderby: user,
                "products.productId": id,
                "products.size": size,
              },
            ],
          },
          {
            $inc: {
              "products.$.count": -count,
              countTotal: -count,
              cartTotal: -(price * count),
            },
          }
        );
      }
        res.status(200).send("The product was removed from the cart");
    } catch (error) {
      console.log(error);
    }
  }
});
