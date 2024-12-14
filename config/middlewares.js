import { GlobalError, ErrorHandling } from "../error/error.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { userModel } from "../scheme/user.js";

export const Protecter = GlobalError(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new ErrorHandling(
        `You are not logged in! Please login to get access..`,
        401
      )
    );
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT);
  const user = await userModel.findById(decode.id);

  if (!user) {
    return next(new ErrorHandling("This user no longer exist", 401));
  }

  req.user = user;
  next();
});
