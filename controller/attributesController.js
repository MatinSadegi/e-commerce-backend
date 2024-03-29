import asyncHandler from "express-async-handler";
import Attribute from "../models/attributesModel.js";

export const getAttributes = asyncHandler(async (req, res) => {
  const allAttributes = await Attribute.find();
  res.json(allAttributes);
});

export const addAttributes = asyncHandler(async (req, res) => {
  const { name, values } = req.body;
  await Attribute.create({ name, values });
  res.json({ message: "added attribute" });
});

//DELETE delete attribute
export const deleteAttribute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
   await Attribute.findOneAndDelete({ name: id });
    res.json({message:'attribute was delete'})
  } catch (error) {
    throw new Error(error);
  }
});
 