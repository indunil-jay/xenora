import express from "express";
import morgan from "morgan";

import tourRouter from "./routes/tour-route";
import AppError from "./utils/app-error";
import globalErrorHandler, {
  unhanldeRoutesHandler,
} from "./controllers/error-controllers";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//middlewares
app.use(express.json());

//Resource Routes
app.use("/api/v1/tours", tourRouter);

//handle unhanlde routes
app.all("*", unhanldeRoutesHandler);

//global error handler catch  operational errors
app.use(globalErrorHandler);

export default app;
