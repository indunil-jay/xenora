import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import User from "../models/user-model";
import AppError from "../utils/app-error";
import { signInToken } from "../utils/jwt-token-generator";
import { sendCookie } from "../utils/send-browser-cookie";
import * as factor from "./handler-factory-controller";

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1. get the user from collection
    const user = await User.findById({ _id: req.user._id }).select("+password");

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
    sendCookie(token, res);
    return res.status(200).json({
      status: "success",
      token,
    });
  }
);

interface FilteredObject {
  [key: string]: any;
}

const filterObj = (
  obj: { [key: string]: any },
  ...allowedFields: string[]
): FilteredObject => {
  const newObj: FilteredObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //create error if user post password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError("this route is not for password updates.", 400));
    }
    //update user doc
    const filterBody = filterObj(req.body, "name", "email");
    const user = await User.findByIdAndUpdate(req.user._id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

//admin
export const deleteUser = factor.deleteOne(User);
export const getUser = factor.getOne(User);
export const getAllUser = factor.getAll(User);
