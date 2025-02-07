import * as paymentService from "../services/payment.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const initializePayment = async (req, res) => {
  try {
    const paymentData = await paymentService.initializePayment(
      req.user.id,
      req.body
    );
    return successResponse(
      res,
      paymentData,
      "Payment initialized successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const payments = await paymentService.getAllPayments(req.query);
    return successResponse(res, payments);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getPaymentById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const payment = await paymentService.getPaymentById(
      Number(req.params.id),
      req.user.id
    );
    return successResponse(res, payment);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

export const getUserPaymentHistory = async (req, res) => {
  try {
    const payments = await paymentService.getUserPaymentHistory(
      req.user.id,
      req.query
    );
    return successResponse(res, payments);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
