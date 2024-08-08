import express from "express";
import * as userController from "../controllers/user-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router();

router.patch("/update-my-password", protect, userController.updatePassword);
router.patch("/update-me", protect, userController.updateMe);
router.delete("/delete-me", protect, userController.deleteMe);

//admin
router
  .route("/:id")
  .get(protect, restrictToPermission("admin"), userController.deleteUser)
  .delete(protect, restrictToPermission("admin"), userController.deleteUser);

export default router;
