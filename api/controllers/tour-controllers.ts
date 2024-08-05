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
    //1 filter
    const queryObj = { ...req.query };
    const excludeFileds = ["page", "sort", "limit", "fields"];
    excludeFileds.forEach((el) => delete queryObj[el]);

    //to allows filter with operators
    //come => { difficulty: 'easy', duration: { gte: '5' } }
    //need => { difficulty: 'easy', duration: { $gte: '5' } }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //2 sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //3. limit fileds
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-createdAt -updatedAt -__v");
    }

    //4, Pagination

    const page = (req.query.page && Number(req.query.page)) || 1;
    const limit = (req.query.limit && Number(req.query.limit)) || 10;
    const skip = (page - 1) * limit;

    // Count total documents and pages
    const totalDocuments = await Tour.countDocuments(JSON.parse(queryStr));
    const totalPages = Math.ceil(totalDocuments / limit);

    //check page exists
    if (req.query.page && skip >= totalDocuments) {
      throw new Error("This page does not exits");
    }

    query = query.skip(skip).limit(limit);

    const tours = await query;

    return res.status(200).json({
      status: "success",
      results: totalDocuments,
      totalPages: totalPages,
      resultsPerPage: limit,
      currentPage: page,
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
