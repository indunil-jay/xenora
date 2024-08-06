import { Request, Response, NextFunction, RequestHandler } from "express";
import Tour from "../models/tour-model";
import QueryHandler from "../utils/query-handler";
import catchAsync from "../utils/catch-async-error";

export const createTour = catchAsync(async (req: Request, res: Response) => {
  const tour = await Tour.create(req.body);

  return res.status(201).json({
    status: "success",
    message: "New tour created successfully.",
    data: {
      tour,
    },
  });
});

export const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const queryHandler = new QueryHandler(Tour.find(), req.query);

  await queryHandler.filter(); //waits because need to counts total docs
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
});

export const getTour = catchAsync(async (req: Request, res: Response) => {
  const tour = await Tour.findById(req.params.id);

  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

export const updateTour = catchAsync(async (req: Request, res: Response) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

export const deleteTour = catchAsync(async (req: Request, res: Response) => {
  await Tour.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    status: "success",
    data: null,
  });
});
