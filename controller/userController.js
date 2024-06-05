import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import { generateRefreshToken } from "../utils/refreshToken.js";
import { setCookie, cookieOptions } from "../utils/setCookie.js";
import Cart from "../models/cartModel.js";

//POST create user
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new Error("User Already Exists");
  }
  const hashedPassword = bcrypt.hashSync(password, 12);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  setCookie(newUser._id, res);

  res.status(200).json({ message: "Account created" });
});

//POST login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throw new Error("User Not Found");
  }

  const validPassword = await bcrypt.compare(password, foundUser.password);

  if (!validPassword) {
    throw new Error("invalid password");
  }
  const newRefreshToken = generateRefreshToken(foundUser?._id);
  foundUser.refreshToken = newRefreshToken;
  res.cookie("accessToken", generateToken(foundUser?._id), cookieOptions);
  res.cookie("refreshToken", newRefreshToken, cookieOptions);
  await foundUser.save();
  const existCart = await Cart.find({ orderby: foundUser._id });
  let quantity = 0;
  const sessionCart = req.session.cart;

  if (sessionCart) {
    if (existCart.length) {
      for (let i = 0; i < existCart[0].products.length; i++) {
        sessionCart.products.map(async (item) => {
          if (
            item.productId === existCart[0].products[i].productId.toString() &&
            existCart[0].products[i].size === item.size
          ) {
            quantity++;
            await Cart.updateOne(
              {
                $and: [
                  {
                    orderby: existCart[0].orderby,
                    "products.product": existCart[0].products[i].product,
                  },
                ],
              },
              {
                $inc: {
                  "products.$.count": item.count,
                },
              }
            );
          }
        });
      }
      if (quantity === 0) {
        await Cart.updateOne(
          {
            $and: [
              {
                orderby: existCart[0].orderby,
                "products.product": existCart[0].products[i].productId,
              },
            ],
          },
          {
            $push: {
              products: {
                count: item.count,
                size: item.size,
                title: item.title,
                price: item.price,
                image: item.image,
                product: item.productId,
              },
            },
          }
        );
      }
      await Cart.updateOne(
        { orderby: foundUser._id },
        {
          $inc: {
            cartTotal: sessionCart.cartTotal,
            countTotal: sessionCart.countTotal,
          },
        }
      );
      req.session.destroy();
    } else {
      const newCart = await Cart.create({
        products: sessionCart.products,
        cartTotal: sessionCart.cartTotal,
        countTotal: sessionCart.countTotal,
        orderby: foundUser._id,
      });
      await User.updateOne(
        { _id: foundUser._id },
        { $set: { cart: newCart._id } }
      );
      req.session.destroy();
    }
  }
  res.status(200).json({
    message: "Login success",
    data: {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
    }, 
  });
});

//GET get user Profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.userId;
  const userFound = await User.findById(user._id);
  res.json(userFound);
});

//GET logout
export const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("accessToken", { httpOnly: true, secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204);
  } else {


    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  }
});

//GET get all users
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

//GET get a user
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

//POST add new address
export const addNewAddress = asyncHandler(async (req, res) => {
  const { city, name, houseNumber, streetName, phoneNumber } = req.body;
  const userId = req.userId;
  if (
    city === "" ||
    name === "" ||
    houseNumber === "" ||
    streetName === "" ||
    phoneNumber === ""
  ) {
    res.status(401).send("please complete all fields");
    return;
  }
  try {
    await User.updateOne({ _id: userId }, { $push: { addresses: req.body } });
    res.status(200).send("new address added");
  } catch (error) {
    throw new Error(error);
  }
});
