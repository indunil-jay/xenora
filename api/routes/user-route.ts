import express from "express";
import * as userController from "../controllers/user-controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.patch("/update-my-password", protect, userController.updatePassword);
router.patch("/update-me", protect, userController.updateMe);

export default router;
