import { ErrorHandling } from "../error/error.js";
import { userModel } from "../scheme/user.js";
import { tokenRespone } from "../config/jwt.js";
import { GlobalError } from "../error/error.js";
export const login = GlobalError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorHandling("Please provide username and password!", 400)
    );
  }
  // const existuser = await userModel.findOne({ personal_info.email }).select("+password");
  const existuser = await userModel
  .findOne({ "personal_info.email": email })
  .select("+personal_info.password");

  if (
    !existuser ||
    !(await existuser.Checkpassword(password, existuser.personal_info.password))
  ) {
    return next(new ErrorHandling("Incorrect username or password!", 401));
  }
  tokenRespone(200, res, existuser);
});

export const signup = GlobalError(async (req, res, next) => {

  const newuser = await userModel.create({
    personal_info: {
      fullname: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    },
  });
  tokenRespone(201, res, newuser);
});

export const getme = (req, res, next) => {
  // req.params.Id = req.user.id;
  // next();
  res.status(200).json(req.user);
};
