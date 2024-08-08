import express from "express";
import * as locationController from "../controllers/location-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictToPermission("admin"),
    locationController.createLocation
  )
  .get(locationController.getAllLocation);

router
  .route("/:id")
  .patch(
    protect,
    restrictToPermission("admin"),
    locationController.updateLocation
  )
  .delete(
    protect,
    restrictToPermission("admin"),
    locationController.deleteLocation
  );

export default router;
