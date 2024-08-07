import { Response } from "express";

export const sendCookie = (token: string, res: Response) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIES_EXPIRES_IN as string, 10) *
          24 *
          60 *
          60 *
          1000
    ),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("access_token", token, cookieOptions);
};
