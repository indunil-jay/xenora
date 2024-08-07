import express from "express";
import * as locationController from "../controllers/location-controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.post("/", protect, locationController.createLocation);

export default router;
