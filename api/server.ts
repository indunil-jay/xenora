import "dotenv/config.js";

import app from "./app";
import connectDB from "./config/database";

//database connection
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is listing to ${PORT}`);
});
