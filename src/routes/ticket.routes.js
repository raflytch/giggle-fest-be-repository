import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByCategory,
  getTicketsByEvent,
} from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateZodRequest } from "../middlewares/validation.middleware.js";
import {
  createTicketSchema,
  updateTicketSchema,
  getTicketsQuerySchema,
} from "../validators/ticket.validator.js";

const router = Router();

router.get(
  "/",
  validateZodRequest({ query: getTicketsQuerySchema }),
  getAllTickets
);

router.get("/category/:categoryId", getTicketsByCategory);
router.get("/event/:eventId", getTicketsByEvent);
router.get("/:id", getTicketById);

router.use(authMiddleware);

router.post(
  "/",
  upload.single("image"),
  validateZodRequest({ body: createTicketSchema }),
  createTicket
);

router.patch(
  "/:id",
  upload.single("image"),
  validateZodRequest({ body: updateTicketSchema }),
  updateTicket
);

router.delete("/:id", deleteTicket);

export default router;
