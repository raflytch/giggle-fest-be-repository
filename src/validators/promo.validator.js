import { z } from "zod";

const numberParser = (val) => {
  if (typeof val === "string") return Number(val);
  if (typeof val === "number") return val;
  return undefined;
};

export const createPromoSchema = z.object({
  code: z.string().min(3).max(20),
  discount: z
    .number()
    .or(z.string().transform(Number))
    .refine((val) => val > 0 && val <= 100, {
      message: "Discount must be between 0 and 100",
    }),
  validFrom: z.string().datetime(),
  validTo: z.string().datetime(),
});

export const updatePromoSchema = z.object({
  code: z.string().min(3).max(20).optional(),
  discount: z
    .number()
    .or(z.string().transform(Number))
    .refine((val) => val > 0 && val <= 100, {
      message: "Discount must be between 0 and 100",
    })
    .optional(),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
});

export const getPromoQuerySchema = z.object({
  page: z.string().or(z.number()).transform(numberParser).optional(),
  limit: z.string().or(z.number()).transform(numberParser).optional(),
});
