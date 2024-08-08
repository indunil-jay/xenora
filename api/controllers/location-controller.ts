import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import Location from "../models/location-model";
import AppError from "../utils/app-error";
import QueryHandler from "../utils/query-handler";
import * as factor from "./handler-factory-controller";

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

export const getAllLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const queryHandler = new QueryHandler(Location.find(), req.query);

    await queryHandler.filter();
    queryHandler.sort().limitFields().paginate();

    const tours = await queryHandler.query;

    return res.status(200).json({
      status: "success",
      currentPage: queryHandler.currentPage,
      totalResults: queryHandler.totalResults,
      totalPages: queryHandler.totalPages,
      resultsPerPage: queryHandler.resultsPerPage,
      data: {
        tours,
      },
    });
  }
);

export const deleteLocation = factor.deleteOne(Location);
