import express from "express";
import * as tourController from "../controllers/tour-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";
import reviewRouter from "./review-route";

const router = express.Router();

router
  .route("/")
  .get(tourController.getAllTours)
  .post(protect, restrictToPermission("admin"), tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(protect, restrictToPermission("admin"), tourController.updateTour)
  .delete(protect, restrictToPermission("admin"), tourController.deleteTour);

//nested route
router.use("/:tourId/reviews", reviewRouter);

// import * as reviewController from "../controllers/review-controller";
// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictToPermission("user"), reviewController.createReview);

export default router;
