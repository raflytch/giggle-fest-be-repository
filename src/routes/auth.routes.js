import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/user.controller.js";
import {
  validateRequest,
  validateZodRequest,
} from "../middlewares/validation.middleware.js";
import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
} from "../validators/user.validator.js";
import { emailVerificationLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/verify/:token", verifyEmail);
router.post(
  "/resend-verification",
  emailVerificationLimiter,
  validateZodRequest({ body: resendVerificationSchema }),
  resendVerificationEmail
);

export default router;
