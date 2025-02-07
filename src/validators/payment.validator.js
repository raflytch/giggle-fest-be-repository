import { z } from "zod";

const numberParser = (val) => {
  if (typeof val === "string") return Number(val);
  if (typeof val === "number") return val;
  return undefined;
};

export const initializePaymentSchema = z.object({
  ticketId: z.string().or(z.number()).transform(numberParser),
  quantity: z
    .string()
    .or(z.number())
    .transform(numberParser)
    .refine((val) => val >= 1, {
      message: "Quantity must be at least 1",
    }),
  promoCode: z.string().optional(),
});

export const getPaymentsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
