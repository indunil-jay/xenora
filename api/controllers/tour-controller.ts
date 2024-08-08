import Tour from "../models/tour-model";
import * as factor from "./handler-factory-controller";

export const getAllTours = factor.getAll(Tour);
export const createTour = factor.createOne(Tour);
export const getTour = factor.getOne(Tour, { populateFields: "reviews" });
export const deleteTour = factor.deleteOne(Tour);
export const updateTour = factor.updateOne(Tour);
