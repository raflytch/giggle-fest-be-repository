import { errorResponse } from "../utils/response.js";
import { verifyToken } from "../utils/token.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, "No token provided", 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid token", 401);
  }
};
