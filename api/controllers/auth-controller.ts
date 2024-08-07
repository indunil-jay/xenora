import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user-model";
import catchAsync from "../utils/catch-async-error";
import AppError from "../utils/app-error";
import { signInToken } from "../utils/jwt-token-generator";
import sendEmail from "../config/email";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, passwordConfirm, name } = req.body;

    const user = await User.create({
      email,
      name,
      password,
      passwordConfirm,
    });

    const { password: p, ...userInfo } = user.toObject();

    const token = signInToken(user._id.toString());

    return res.status(201).json({
      status: "success",
      token,
      data: {
        user: userInfo,
      },
    });
  }
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //1) check if email and password exists
    if (!email || !password) {
      return next(new AppError("please provide email and password.", 400));
    }
    //2) check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("invalid credential.", 401));
    }

    const token = signInToken(user._id.toString());

    //3) if everything ok, send token to client
    return res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1. get user posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return next(new AppError("there is no user with email address.", 404));

    //2. generate random token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3.send it as email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    const message = `forgot your password? reset your password using this link ${resetUrl}.\n if you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        text: message,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "there was an error sending the email. try again later.",
          500
        )
      );
    }

    //4 send response
    return res.status(200).json({
      status: "success",
      message: "Token has sent to your email!.",
    });
  }
);
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1. get user based on the token
    const hashedToken = await crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    //2. if token has not has expired, and there is user set the new password
    if (!user) {
      return next(new AppError("token is invalid or has expired.", 400));
    }

    //3. update the passwordchange property
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    //4. send res
    const token = signInToken(user._id.toString());
    res.status(200).json({
      status: "success",
      token,
    });
  }
);
