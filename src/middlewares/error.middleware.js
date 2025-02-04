import { errorResponse } from "../utils/response.js";

export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  return errorResponse(res, err.message);
};

export const notFoundMiddleware = (req, res) => {
  return errorResponse(res, "Route not found", 404);
};
