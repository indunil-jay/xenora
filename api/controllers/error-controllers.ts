import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";

const globalErrorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export default globalErrorHandler;

export const unhanldeRoutesHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server.`, 404)
  );
};
