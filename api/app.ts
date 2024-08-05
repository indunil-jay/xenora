import express from "express";
import morgan from "morgan";

import tourRouter from "./routes/tour-routes";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//middlewares
app.use(express.json());

//Resource Routes
app.use("/api/v1/tours", tourRouter);

export default app;
