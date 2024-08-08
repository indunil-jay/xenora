import express from "express";
import * as reviewController from "../controllers/review-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";
import { setTourAndUserId } from "../middleware/set-tour-and-user-id";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(
    protect,
    restrictToPermission("user"),
    setTourAndUserId,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    protect,
    restrictToPermission("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    protect,
    restrictToPermission("user", "admin"),
    reviewController.deleteReview
  );

export default router;
