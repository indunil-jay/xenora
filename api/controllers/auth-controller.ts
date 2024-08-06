import { NextFunction, Request, Response } from "express";
import User from "../models/user-model";
import catchAsync from "../utils/catch-async-error";
import AppError from "../utils/app-error";
import { signInToken } from "../utils/jwt-token-generator";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, passwordConfirm, name } = req.body;

    const user = await User.create({
      email,
      name,
      password,
      passwordConfirm,
    });

    const { password: p, ...userInfo } = user.toObject();

    const token = signInToken(user._id.toString());

    return res.status(201).json({
      status: "success",
      token,
      data: {
        user: userInfo,
      },
    });
  }
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //1) check if email and password exists
    if (!email || !password) {
      return next(new AppError("please provide email and password.", 400));
    }
    //2) check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("invalid credential.", 401));
    }

    const token = signInToken(user._id.toString());

    //3) if everything ok, send token to client
    return res.status(200).json({
      status: "success",
      token,
    });
  }
);
