import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import User from "../models/user-model";
import AppError from "../utils/app-error";
import { signInToken } from "../utils/jwt-token-generator";

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1. get the user from collection
    const user = await User.findOne({ email: req.user.email }).select(
      "+password"
    );
    console.log({ user });
    //2. check if posted current password is correct.
    if (
      !(await user!.correctPassword(req.body.passwordCurrent, user!.password))
    ) {
      return next(new AppError(`your current password is wrong`, 401));
    }
    //3. if,so update  password
    user!.password = req.body.password;
    user!.passwordConfirm = req.body.passwordConfirm;
    await user!.save();
    //4. log in, send JWT
    const token = signInToken(user!._id.toString());

    return res.status(200).json({
      status: "success",
      token,
    });
  }
);
