import { errorResponse } from "../utils/response.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return errorResponse(res, errorMessage, 400);
    }

    next();
  };
};

// validate zod
export const validateZodRequest = (schemas) => {
  return async (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        return errorResponse(res, errorMessages, 400);
      }
      return errorResponse(res, "Validation failed", 400);
    }
  };
};
