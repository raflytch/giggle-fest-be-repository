import { z } from "zod";

const numberParser = (val) => {
  if (typeof val === "string") return Number(val);
  if (typeof val === "number") return val;
  return undefined;
};

export const createPromoSchema = z.object({
  code: z.string().min(3).max(20),
  discount: z
    .string()
    .or(z.number())
    .transform(numberParser)
    .refine((val) => val > 0 && val <= 100, {
      message: "Discount must be between 0 and 100",
    }),
  validFrom: z.string(),
  validTo: z.string(),
});

export const updatePromoSchema = z.object({
  code: z.string().min(3).max(20).optional(),
  discount: z
    .string()
    .or(z.number())
    .transform(numberParser)
    .refine((val) => val > 0 && val <= 100, {
      message: "Discount must be between 0 and 100",
    })
    .optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

export const getPromoQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
