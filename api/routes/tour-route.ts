import express from "express";
import * as tourController from "../controllers/tour-controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router
  .route("/")
  .get(protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(protect, tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
