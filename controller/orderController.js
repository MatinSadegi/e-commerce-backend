import expressAsyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import User from "../models/userModel.js";
import Order from "../models/OrderModel.js";
import { v4 as uuidv4 } from "uuid";
export const createOrder = expressAsyncHandler(async (req, res) => {
  const user = req.userId;
  const currentUser = await User.findById(user);
  try {
    let userCart = await Cart.findOne({ orderby: user });
    if (!userCart || userCart?.products.length === 0) {
      res.status(404).send(" Cart is Empty");
    }

    let finalAmount = 0;
    if (userCart.discount) {
      finalAmount = userCart.cartTotal - userCart.discount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await Order.create({
      products: userCart.products,
      paymentIntent: {
        id: uuidv4(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user,
      orderStatus: "Cash on Delivery",
    });
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.productId },
          update: {
            $inc: { [`quantity.${item.size}`]: -item.count, sold: +item.count },
          },
        },
      };
    });
    await Product.bulkWrite(update, {});
    await User.updateOne(
      { _id: user },
      {
        $set: {
          orders: [newOrder._id, ...currentUser.orders],
        },
        $unset: {
          cart: "",
        },
      }
    );
    await Cart.deleteOne({ _id: userCart._id });
    res.send("success");
  } catch (error) {
    console.log(error);
  }
});
