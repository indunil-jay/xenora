import { Request, Response } from "express";
import Tour from "../models/tour-model";
import QueryHandler from "../utils/query-handler";

export const createTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.create(req.body);

    return res.status(201).json({
      status: "success",
      message: "New tour created successfully.",
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const getAllTours = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    const catchedError = error as Error;
    return res.status(404).json({
      status: "fail",
      message: catchedError.message,
    });
  }
};

export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);

    return res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
