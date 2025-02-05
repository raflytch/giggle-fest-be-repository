import Joi from "joi";
import { z } from "zod";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  age: Joi.number().required(),
  phoneNumber: Joi.string().required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  name: Joi.string(),
  age: Joi.number(),
  phoneNumber: Joi.string(),
  role: Joi.string().valid("user", "admin"),
});

// zod
export const getUsersQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    search: z.string().optional().default(""),
  })
  .refine(
    (data) => {
      if (data.page && data.page < 1) return false;
      if (data.limit && data.limit < 1) return false;
      return true;
    },
    {
      message: "Page and limit must be positive numbers",
    }
  );

// resend verification zod
export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email format"),
});
