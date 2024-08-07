import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import globalErrorHandler, {
  unhanldeRoutesHandler,
} from "./controllers/error-controller";
import tourRouter from "./routes/tour-route";
import authRouter from "./routes/auth-route";
import userRouter from "./routes/user-route";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//middlewares

//set  security HTTP headers
app.use(helmet());

//body parser (reading req.body)
app.use(express.json({ limit: "10kb" }));

//data sanitization NOSQL query injection
app.use(mongoSanitize({ allowDots: true }));

//limit request from same IP
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "too many request from this IP, please try again in an hour.",
});
app.use("/api", limiter);

//Resource Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

//handle unhanlde routes
app.all("*", unhanldeRoutesHandler);

//global error handler catch  operational errors
app.use(globalErrorHandler);

export default app;
