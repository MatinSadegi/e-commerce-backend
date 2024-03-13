import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    brand: { type: String, required: true },
    color: { type: String, required: true },
    gender: { type: String, required: true },
    quantity: {
      sm: Number,
      md: Number,
      lg: Number,
      xl: Number,
    },
    inventory: { type: String, required: true },
    trending: { type: Boolean, required: true },

    sold: { type: Number, default: 0 },
    image: {
      public_id: String,
      url: String,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
