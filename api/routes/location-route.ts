import express from "express";
import * as locationController from "../controllers/location-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router();

router
  .route("/")
  .post(protect, locationController.createLocation)
  .get(protect, locationController.getAllLocation);

router
  .route("/:id")
  .delete(
    protect,
    restrictToPermission("admin"),
    locationController.deleteLocation
  );

export default router;
