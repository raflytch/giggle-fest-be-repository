import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import eventRoutes from "./event.routes.js";
import categoryRoutes from "./category.routes.js";
import ticketRoutes from "./ticket.routes.js";
import reviewRoutes from "./review.routes.js";
import cartRoutes from "./cart.routes.js";
import paymentRoutes from "./payment.routes.js";
import promoRoutes from "./promo.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/categories", categoryRoutes);
router.use("/tickets", ticketRoutes);
router.use("/reviews", reviewRoutes);
router.use("/cart", cartRoutes);
router.use("/payments", paymentRoutes);
router.use("/promos", promoRoutes);
router.use("/notifications", notificationRoutes);

export default router;
