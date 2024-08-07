import express from "express";
import * as locationController from "../controllers/location-controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router
  .route("/")
  .post(protect, locationController.createLocation)
  .get(protect, locationController.getAllLocation);

export default router;
