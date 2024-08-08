import express from "express";
import * as locationController from "../controllers/location-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(restrictToPermission("admin"), locationController.createLocation)
  .get(locationController.getAllLocation);

router
  .route("/:id")
  .get(restrictToPermission("admin"), locationController.getLocation)
  .patch(restrictToPermission("admin"), locationController.updateLocation)
  .delete(restrictToPermission("admin"), locationController.deleteLocation);

export default router;
