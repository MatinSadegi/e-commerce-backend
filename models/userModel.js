import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    cart: { type: Array, default: [] },
    address: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken:{type:String}
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
