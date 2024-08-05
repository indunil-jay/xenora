import mongoose from "mongoose";

/**
 * Asynchronously connects to the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
