import { Router } from "express";
import {
  updateUserDetails,
  deleteUserDetails,
  getAllUserDetails,
  getUserDetails,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import { updateUserSchema } from "../validators/user.validator.js";
import { getUsersQuerySchema } from "../validators/user.validator.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  validateZodRequest({ query: getUsersQuerySchema }),
  getAllUserDetails
);

router.get("/:id", getUserDetails);

router.patch(
  "/:id",
  validateZodRequest({ body: updateUserSchema }),
  updateUserDetails
);

router.delete("/:id", deleteUserDetails);

export default router;
