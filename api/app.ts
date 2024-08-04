import express from "express";

import tourRouter from "./routes/tour-routes";

const app = express();

app.use(express.json());

app.use("/api/v1/tours", tourRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server is listing t0 ${PORT}`);
});
