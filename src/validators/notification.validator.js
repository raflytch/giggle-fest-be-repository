import { z } from "zod";

export const createNotificationSchema = z.object({
  message: z.string().min(1),
  userId: z.union([z.number(), z.literal("all")]),
});

export const getNotificationsQuerySchema = z.object({
  page: z.string().or(z.number()).optional(),
  limit: z.string().or(z.number()).optional(),
});
