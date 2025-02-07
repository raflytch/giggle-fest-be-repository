import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import eventRoutes from "./event.routes.js";
import categoryRoutes from "./category.routes.js";
import ticketRoutes from "./ticket.routes.js";
import reviewRoutes from "./review.routes.js";
import cartRoutes from "./cart.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/categories", categoryRoutes);
router.use("/tickets", ticketRoutes);
router.use("/reviews", reviewRoutes);
router.use("/cart", cartRoutes);

export default router;
