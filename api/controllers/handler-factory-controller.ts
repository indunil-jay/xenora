import { Request, Response, NextFunction } from "express";
import { Document, Model } from "mongoose";
import catchAsync from "../utils/catch-async-error";
import AppError from "../utils/app-error";

export const deleteOne = <T extends Document>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(
          `no ${Model.collection.name
            .toLowerCase()
            .slice(0, -1)} found with that id.`,
          404
        )
      );
    }

    return res.status(200).json({
      status: "success",
      data: null,
    });
  });
};
