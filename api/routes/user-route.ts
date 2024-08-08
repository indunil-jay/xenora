import express from "express";
import * as userController from "../controllers/user-controller";
import { protect } from "../middleware/protect";
import { restrictToPermission } from "../middleware/restric-permission";

const router = express.Router();

router.use(protect);

router.get("/me", userController.getMe, userController.getUser);
router.patch("/update-my-password", userController.updatePassword);
router.patch("/update-me", userController.updateMe);
router.delete("/delete-me", userController.deleteMe);

//admin
router.use(restrictToPermission("admin"));

router.get("/", userController.getAllUser);
router
  .route("/:id")
  .get(userController.deleteUser)
  .delete(userController.deleteUser);

export default router;
