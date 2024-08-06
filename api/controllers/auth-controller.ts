import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user-model";
import catchAsync from "../utils/catch-async-error";
import AppError from "../utils/app-error";

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });

    //3) if everything ok, send token to client
    return res.status(200).json({
      status: "success",
      token,
    });
  }
);
