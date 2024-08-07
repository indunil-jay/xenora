import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import User from "../models/user-model";
import AppError from "../utils/app-error";
import { signInToken } from "../utils/jwt-token-generator";

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1. get the user from collection
    const user = await User.findById({ _id: req.user._id }).select("+password");
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
