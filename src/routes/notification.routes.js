import { Router } from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  createNotificationSchema,
  getNotificationsQuerySchema,
} from "../validators/notification.validator.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  validateZodRequest({ body: createNotificationSchema }),
  createNotification
);

router.get(
  "/",
  validateZodRequest({ query: getNotificationsQuerySchema }),
  getUserNotifications
);

router.patch("/:id/read", markAsRead);
router.patch("/:id/unread", markAsUnread);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
