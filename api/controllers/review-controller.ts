import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import Review from "../models/review-model";

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

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user._id;

    const review = await Review.create(req.body);

    return res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);
