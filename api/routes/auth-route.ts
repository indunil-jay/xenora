import express from "express";
import * as authController from "../controllers/auth-controller";

const router = express.Router();

router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:resetToken", authController.resetPassword);

export default router;
