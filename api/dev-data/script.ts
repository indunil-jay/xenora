import "dotenv/config.js";

import fs from "fs";
import connectDB from "../config/database";
import Tour from "../models/tour-model";
import Location from "../models/location-model";

connectDB();

const tours = JSON.parse(fs.readFileSync("dev-data/data/tours.json", "utf-8"));
const locations = JSON.parse(
  fs.readFileSync("dev-data/data/locations.json", "utf-8")
);

/**
 * Import sample tour data into the database.
 *
 * This function creates new tour entries in the database using the data provided in the `tours` array.
 * It logs a success message if the data is successfully imported, and logs an error message if an error occurs.
 *
 * @async
 * @function importData
 * @returns {Promise<void>} A promise that resolves when the data import operation is complete.
 */

const importData = async (): Promise<void> => {
  try {
    await Tour.create(tours);
    await Location.create(locations);
    console.log("Data successfully imported.");
    process.exit(1);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

/**
 * Delete all tour data from the database.
 *
 * This function deletes all tour entries from the database. It logs a success message if the data is successfully deleted,
 * and logs an error message if an error occurs.
 *
 * @async
 * @function deleteData
 * @returns {Promise<void>} A promise that resolves when the data deletion operation is complete.
 */

const deleteData = async (): Promise<void> => {
  try {
    await Tour.deleteMany();
    await Location.deleteMany();
    console.log("Data successfully deleted.");
    process.exit(1);
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
