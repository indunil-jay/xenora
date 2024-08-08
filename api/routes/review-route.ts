import express from "express";
import * as reviewController from "../controllers/review-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(protect, restrictToPermission("user"), reviewController.createReview);

router
  .route("/:id")
  .delete(
    protect,
    restrictToPermission("admin"),
    reviewController.deleteReview
  );

export default router;
