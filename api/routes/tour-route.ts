import express from "express";
import * as tourController from "../controllers/tour-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router();

router
  .route("/")
  .get(protect, restrictToPermission("admin"), tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(protect, tourController.getTour)
  .patch(protect, tourController.updateTour)
  .delete(protect, restrictToPermission("admin"), tourController.deleteTour);

export default router;
