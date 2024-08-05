import { Request, Response } from "express";
import Tour from "../models/tour-model";
import { match } from "assert";

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
    const queryObj = { ...req.query };
    const excludeFileds = ["page", "sort", "limit", "fields"];

    excludeFileds.forEach((el) => delete queryObj[el]);

    //to allows filter with operators
    //come => { difficulty: 'easy', duration: { gte: '5' } }
    //need => { difficulty: 'easy', duration: { $gte: '5' } }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr));

    const tours = await query;

    return res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
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
