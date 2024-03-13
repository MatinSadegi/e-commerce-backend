import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: { type: Number, required: true },
        size: { type: String, required: true },
        image: {
          public_id: String,
          url: String,
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartTotal: { type: Number },
    countTotal: { type: Number },
    discount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
