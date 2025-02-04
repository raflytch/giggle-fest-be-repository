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
