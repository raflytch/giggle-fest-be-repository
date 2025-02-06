import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
});

export const updateCategorySchema = createCategorySchema.partial();

export const getCategoriesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});
