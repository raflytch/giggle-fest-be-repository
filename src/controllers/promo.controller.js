import * as promoService from "../services/promo.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createPromoCode = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    const promoCode = await promoService.createPromoCode(req.body);
    return successResponse(
      res,
      promoCode,
      "Promo code created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllPromoCodes = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    const promoCodes = await promoService.getAllPromoCodes(req.query);
    return successResponse(res, promoCodes);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const validatePromoCode = async (req, res) => {
  try {
    const promoCode = await promoService.validatePromoCode(req.params.code);
    return successResponse(res, promoCode);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updatePromoCode = async (req, res) => {
  try {
    const promoCode = await promoService.updatePromoCode(
      Number(req.params.id),
      req.body
    );
    return successResponse(res, promoCode, "Promo code updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deletePromoCode = async (req, res) => {
  try {
    await promoService.deletePromoCode(Number(req.params.id));
    return successResponse(res, null, "Promo code deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
