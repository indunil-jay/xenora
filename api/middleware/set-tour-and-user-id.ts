import { NextFunction, Request, Response } from "express";
export const setTourAndUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
