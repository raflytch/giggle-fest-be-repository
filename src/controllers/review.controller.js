import * as reviewService from "../services/review.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createReview = async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      userId: req.user.id,
    };
    const review = await reviewService.createReview(reviewData);
    return successResponse(res, review, "Review created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews(req.query);
    return successResponse(res, reviews);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(Number(req.params.id));
    return successResponse(res, review);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

export const getReviewsByTicket = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByTicket(
      Number(req.params.ticketId),
      req.query
    );
    return successResponse(res, reviews);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByUser(
      Number(req.params.userId),
      req.query
    );
    return successResponse(res, reviews);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(
      Number(req.params.id),
      req.user.id,
      req.body
    );
    return successResponse(res, review, "Review updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(Number(req.params.id), req.user.id);
    return successResponse(res, null, "Review deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
