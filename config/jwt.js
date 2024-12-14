import jwt from "jsonwebtoken";
import "dotenv/config"

export const CookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "None",
  secure: true,
  domain: ".onrender.com",
  
};

const tokenSender = (id) => {
  return jwt.sign({ id }, process.env.JWT, { expiresIn: process.env.JWTEX });
};

export const tokenRespone = (statuscode, res, user) => {
  const token = tokenSender(user._id);

  res.cookie("jwt", token, CookieOption).status(statuscode).json({
    status: "success",
    token,
  });
};



