import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: { type: Number, required: true },
        size: { type: String, required: true },
      },
    ],
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartTotal: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
