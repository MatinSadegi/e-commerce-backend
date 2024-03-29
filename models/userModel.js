import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    refreshToken: { type: String },
    addresses: [
      {
        name: String,
        city: String,
        streetName: String,
        houseNumber: Number,
        phoneNumber: Number,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
