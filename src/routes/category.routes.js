import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesQuerySchema,
} from "../validators/category.validator.js";

const router = Router();

router.get(
  "/",
  validateZodRequest({ query: getCategoriesQuerySchema }),
  getAllCategories
);

router.get("/:id", getCategoryById);

router.use(authMiddleware);

router.post(
  "/",
  validateZodRequest({ body: createCategorySchema }),
  createCategory
);

router.patch(
  "/:id",
  validateZodRequest({ body: updateCategorySchema }),
  updateCategory
);

router.delete("/:id", deleteCategory);

export default router;
