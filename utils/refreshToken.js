import jwt from "jsonwebtoken";

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
};

