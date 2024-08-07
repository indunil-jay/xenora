import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async-error";
import AppError from "../utils/app-error";
import User, { IUser } from "../models/user-model";

declare global {
  namespace Express {
    interface Request {
      user: Readonly<
        Omit<IUser, "password" | "passwordConfirm" | "passwordChangedAt">
      >;
    }
  }
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1 getting token and check of it's there
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return next(
        new AppError("you are not logged in!. please log in to access.", 401)
      );

    //2 verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    //3 check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError("the user belongs to the token no longer exists.", 401)
      );
    }

    //4 check if user change password after jwt issue
    if (await currentUser.isChangedPassword(decoded.iat!)) {
      return next(
        new AppError(
          "the user recently changed password!. please log in again.",
          401
        )
      );
    }

    req.user = currentUser as IUser;
    next();
  }
);
