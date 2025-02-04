import { Router } from "express";
import {
  updateUserDetails,
  deleteUserDetails,
  getAllUserDetails,
  getUserDetails,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { updateSchema } from "../validators/user.validator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllUserDetails);
router.get("/:id", getUserDetails);
router.put("/:id", validateRequest(updateSchema), updateUserDetails);
router.delete("/:id", deleteUserDetails);

export default router;
