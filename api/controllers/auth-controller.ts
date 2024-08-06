import { NextFunction, Request, Response } from "express";
import User from "../models/user-model";
import catchAsync from "../utils/catch-async-error";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, passwordConfirm, name } = req.body;

    const user = await User.create({
      email,
      name,
      password,
      passwordConfirm,
    });

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);
