import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async function and passes any errors to the next middleware.
 *
 * @param {RequestHandler} fn - The async function to be wrapped.
 * @returns {RequestHandler} - The wrapped function with error handling.
 */
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};

export default catchAsync;
