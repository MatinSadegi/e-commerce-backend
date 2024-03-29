import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    values: { type: Array, required: true},
  },
  { timestamps: true }
);

const Attribute = mongoose.model("Attribute", attributeSchema);
export default Attribute;
