import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";

const sendErrorToDevelopmentEnviroment = (error: AppError, res: Response) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

const sendErrorToProductionEnviroment = (error: AppError, res: Response) => {
  //operational error that need to be know the client
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  //programming error or bugs that don't leak to the client (send generic message)
  else {
    return res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const globalErrorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorToDevelopmentEnviroment(error, res);
  }
  if (process.env.NODE_ENV === "production") {
    sendErrorToProductionEnviroment(error, res);
  }
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
