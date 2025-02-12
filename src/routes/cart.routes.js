import { Router } from "express";
import {
  addToCart,
  getCartByUser,
  updateCartQuantity,
  removeFromCart,
  checkout,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  addToCartSchema,
  updateCartSchema,
} from "../validators/cart.validator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getCartByUser);

router.post("/", validateZodRequest({ body: addToCartSchema }), addToCart);

router.patch(
  "/:id",
  validateZodRequest({ body: updateCartSchema }),
  updateCartQuantity
);

router.delete("/:id", removeFromCart);

router.post("/checkout", checkout);

export default router;
