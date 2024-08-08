import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import Review from "../models/review-model";
import * as factor from "./handler-factory-controller";

export const getAllReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //use get all reviews on a tour  tour/tourId/reviews
    let filter: { tour?: string } = {};

    if (req.params.tourId) {
      filter.tour = req.params.tourId;
    }

    const reviews = await Review.find(filter);

    return res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  }
);

export const createReview = factor.createOne(Review);
export const deleteReview = factor.deleteOne(Review);
export const updateReview = factor.updateOne(Review);
export const getReview = factor.getOne(Review);
