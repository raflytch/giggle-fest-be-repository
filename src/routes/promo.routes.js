import { Router } from "express";
import {
  createPromoCode,
  getAllPromoCodes,
  validatePromoCode,
  updatePromoCode,
  deletePromoCode,
} from "../controllers/promo.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  createPromoSchema,
  updatePromoSchema,
  getPromoQuerySchema,
} from "../validators/promo.validator.js";

const router = Router();

router.get("/validate/:code", validatePromoCode);

router.use(authMiddleware);

router.post(
  "/",
  validateZodRequest({ body: createPromoSchema }),
  createPromoCode
);

router.get(
  "/",
  validateZodRequest({ query: getPromoQuerySchema }),
  getAllPromoCodes
);

router.patch(
  "/:id",
  validateZodRequest({ body: updatePromoSchema }),
  updatePromoCode
);

router.delete("/:id", deletePromoCode);

export default router;
