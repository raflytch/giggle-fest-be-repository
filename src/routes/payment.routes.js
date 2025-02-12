import { Router } from "express";
import {
  initializePayment,
  getAllPayments,
  getPaymentById,
  getUserPaymentHistory,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  initializePaymentSchema,
  getPaymentsQuerySchema,
} from "../validators/payment.validator.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/initialize",
  validateZodRequest({ body: initializePaymentSchema }),
  initializePayment
);

router.get(
  "/",
  validateZodRequest({ query: getPaymentsQuerySchema }),
  getAllPayments
);

router.get("/history", getUserPaymentHistory);
router.get("/:id", getPaymentById);

export default router;
