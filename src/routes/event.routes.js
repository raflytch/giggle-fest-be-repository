import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  createEventSchema,
  updateEventSchema,
  getEventsQuerySchema,
} from "../validators/event.validator.js";

const router = Router();

router.get(
  "/",
  validateZodRequest({ query: getEventsQuerySchema }),
  getAllEvents
);

router.get("/:id", getEventById);

router.use(authMiddleware);

router.post(
  "/",
  upload.single("image"),
  validateZodRequest({ body: createEventSchema }),
  createEvent
);

router.patch(
  "/:id",
  upload.single("image"),
  validateZodRequest({ body: updateEventSchema }),
  updateEvent
);

router.delete("/:id", deleteEvent);

export default router;
