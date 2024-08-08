import { Request, Response, NextFunction } from "express";
import { Document, Model } from "mongoose";
import catchAsync from "../utils/catch-async-error";
import AppError from "../utils/app-error";

interface IOptions {
  errorMsg: string;
}

export const deleteOne = <T extends Document>(
  Model: Model<T>,
  option: IOptions
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(option.errorMsg, 404));
    }

    return res.status(200).json({
      status: "success",
      data: null,
    });
  });
};
