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
  forgotPasswordSchema,
  generateOTPSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from "../validators/user.validator.js";
import { emailVerificationLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  generateOTP,
  initPasswordReset,
  resetPassword,
  verifyOTP,
} from "../controllers/password.controller.js";

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

// password reset routes
router.post(
  "/forgot-password",
  validateZodRequest({ body: forgotPasswordSchema }),
  initPasswordReset
);
router.post(
  "/generate-otp",
  validateZodRequest({ body: generateOTPSchema }),
  generateOTP
);
router.post(
  "/verify-otp",
  validateZodRequest({ body: verifyOTPSchema }),
  verifyOTP
);
router.post(
  "/reset-password",
  validateZodRequest({ body: resetPasswordSchema }),
  resetPassword
);

export default router;
