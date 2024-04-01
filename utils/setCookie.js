import { generateToken } from "./generateToken.js";
import { generateRefreshToken } from "./refreshToken.js";

export const cookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 7,
  httpOnly: true, // The cookie only accessible by the web server
  sameSite: "none",
  secure: true,
};

export function setCookie(user, res) {
  res.cookie("accessToken", generateToken(user), cookieOptions); 
  res.cookie("refreshToken", generateRefreshToken(user), cookieOptions); 
}

