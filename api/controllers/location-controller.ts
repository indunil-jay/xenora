import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import Location from "../models/location-model";
import AppError from "../utils/app-error";

export const createLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coordinates, name } = req.body;
    if (!coordinates || !name) {
      return next(
        new AppError(
          "name and cordinates are required for create a location.",
          400
        )
      );
    }
    const location = await Location.create({ coordinates, name });

    return res.status(201).json({
      status: "success",
      message: "new location created successfully.",
      data: {
        location,
      },
    });
  }
);
