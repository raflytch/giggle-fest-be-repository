import { z } from "zod";

const numberParser = (val) => {
  if (typeof val === "string") return Number(val);
  if (typeof val === "number") return val;
  return undefined;
};

export const createReviewSchema = z.object({
  rating: z
    .string()
    .or(z.number())
    .transform(numberParser)
    .refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    }),
  comment: z.string().min(1, "Comment is required"),
  ticketId: z.string().or(z.number()).transform(numberParser),
});

export const updateReviewSchema = z.object({
  rating: z
    .string()
    .or(z.number())
    .transform(numberParser)
    .refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    })
    .optional(),
  comment: z.string().min(1, "Comment is required").optional(),
});

export const getReviewsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
