import express from "express";
import * as userController from "../controllers/user-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router();

router.get("/me", protect, userController.getMe, userController.getUser);
router.patch("/update-my-password", protect, userController.updatePassword);
router.patch("/update-me", protect, userController.updateMe);
router.delete("/delete-me", protect, userController.deleteMe);

//admin
router.get(
  "/",
  protect,
  restrictToPermission("admin"),
  userController.getAllUser
);
router
  .route("/:id")
  .get(protect, restrictToPermission("admin"), userController.deleteUser)
  .delete(protect, restrictToPermission("admin"), userController.deleteUser);

export default router;
