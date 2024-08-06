import "dotenv/config.js";
import app from "./app";
import connectDB from "./config/database";

//handle unhadle synchronus errors.
process.on("uncaughtException", () => {
  console.log("UNHANDLE EXECTION!");
  console.log("shutting down...");

  process.exit(1);
});

//database connection
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`server is listing to ${PORT}`);
});

//handle unhandle asynchronus error.
process.on("unhandledRejection", (error) => {
  console.log("UNHANDLE REJECTION!");
  console.log("shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
