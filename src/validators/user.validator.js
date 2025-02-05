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

export const updateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    age: z.number().min(1, "Age must be greater than 0").optional(),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
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

// otp zod
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const generateOTPSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const verifyOTPSchema = z.object({
  token: z.string().min(1, "Token is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
