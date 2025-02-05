import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  date: z.string().transform((str) => new Date(str)),
  location: z.string().min(1),
});

export const updateEventSchema = createEventSchema.partial();

export const getEventsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
