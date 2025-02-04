import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../validators/user.validator.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);

export default router;
