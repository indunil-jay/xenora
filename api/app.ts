import express from "express";
import morgan from "morgan";

import globalErrorHandler, {
  unhanldeRoutesHandler,
} from "./controllers/error-controller";
import tourRouter from "./routes/tour-route";
import authRouter from "./routes/auth-route";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//middlewares
app.use(express.json());

//Resource Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/auth", authRouter);

//handle unhanlde routes
app.all("*", unhanldeRoutesHandler);

//global error handler catch  operational errors
app.use(globalErrorHandler);

export default app;
