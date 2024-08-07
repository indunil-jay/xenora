import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";

export const restrictToPermission = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};
