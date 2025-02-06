import { z } from "zod";

const numberParser = (val) => {
  if (typeof val === "string") return Number(val);
  if (typeof val === "number") return val;
  return undefined;
};

export const createTicketSchema = z.object({
  name: z.string().min(1),
  price: z.string().or(z.number()).transform(numberParser),
  quantity: z.string().or(z.number()).transform(numberParser),
  eventId: z.string().or(z.number()).transform(numberParser),
  categoryId: z.string().or(z.number()).transform(numberParser),
  artist: z.string().optional(),
});

export const updateTicketSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.string().or(z.number()).transform(numberParser).optional(),
  quantity: z.string().or(z.number()).transform(numberParser).optional(),
  artist: z.string().optional(),
});

export const getTicketsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  artist: z.string().optional(),
  eventId: z.string().optional(),
  categoryId: z.string().optional(),
});
