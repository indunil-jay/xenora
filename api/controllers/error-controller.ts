import { CastError } from "mongoose";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import { MongoServerError } from "mongodb";

const sendErrorToDevelopmentEnvironment = (error: AppError, res: Response) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

const sendErrorToProductionEnvironment = (error: AppError, res: Response) => {
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

/**
 * Handles MongoDB CastError and converts it to an AppError instance.
 *
 * @param {CastError} error - The original MongoDB CastError object.
 * @returns {AppError} - The formatted AppError instance with a 400 status code.
 */

const handleDatabaseCastError = (error: CastError): AppError => {
  const message = `Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 400);
};

/**
 * Handles MongoDB duplicate key errors and converts them to AppError instances.
 *
 * @param {MongoServerError} error - The original MongoDB error object.
 * @returns {AppError} - The formatted AppError instance.
 */
const handleDatabaseDuplicateFields = (error: MongoServerError): AppError => {
  if (error.errorResponse && error.errorResponse.errmsg) {
    const errmsg = error.errorResponse.errmsg;
    const match = errmsg.match(/(["'])(\\?.)*?\1/);
    const value = match ? match[0] : "unknown value";
    const message = `Duplicate field value: ${value}. Please use another value!`;

    return new AppError(message, 400);
  } else {
    return new AppError(
      "something went wrong with connect with database.",
      500
    );
  }
};

/**
 * Handles mongoose schema validation errors and converts them to AppError instances.
 *
 * @param {any} error - the validator error object
 * @returns The formatted AppError instance.
 */

const handleDatabaseValidationError = (error: any): AppError => {
  const errors = Object.values(error.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
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
    sendErrorToDevelopmentEnvironment(error, res);
  }
  if (process.env.NODE_ENV === "production") {
    let errObj: any = { ...error };

    if (error.name === "CastError") {
      errObj = handleDatabaseCastError(errObj);
    }

    if (errObj.code === 11000) {
      errObj = handleDatabaseDuplicateFields(errObj);
    }

    if (error.name === "ValidationError") {
      errObj = handleDatabaseValidationError(errObj);
    }

    sendErrorToProductionEnvironment(errObj, res);
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
