import Joi from "joi";

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
