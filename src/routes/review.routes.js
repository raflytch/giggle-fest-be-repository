import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByTicket,
  getReviewsByUser,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsQuerySchema,
} from "../validators/review.validator.js";

const router = Router();

router.get(
  "/",
  validateZodRequest({ query: getReviewsQuerySchema }),
  getAllReviews
);

router.get("/ticket/:ticketId", getReviewsByTicket);
router.get("/user/:userId", getReviewsByUser);
router.get("/:id", getReviewById);

router.use(authMiddleware);

router.post(
  "/",
  validateZodRequest({ body: createReviewSchema }),
  createReview
);

router.patch(
  "/:id",
  validateZodRequest({ body: updateReviewSchema }),
  updateReview
);

router.delete("/:id", deleteReview);

export default router;
