import * as reviewRepository from "../repositories/review.repository.js";
import * as ticketRepository from "../repositories/ticket.repository.js";

export const createReview = async (reviewData) => {
  const ticket = await ticketRepository.findTicketById(reviewData.ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const existingReviews = await reviewRepository.findReviewsByTicket(
    reviewData.ticketId,
    { page: 1, limit: 100 }
  );
  const hasReviewed = existingReviews.reviews.some(
    (review) => review.user.id === reviewData.userId
  );
  if (hasReviewed) {
    throw new Error("You have already reviewed this ticket");
  }

  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return reviewRepository.createReview(reviewData);
};

export const getAllReviews = async (query) => {
  return reviewRepository.findAllReviews(query);
};

export const getReviewById = async (id) => {
  const review = await reviewRepository.findReviewById(id);
  if (!review) {
    throw new Error("Review not found");
  }
  return review;
};

export const getReviewsByTicket = async (ticketId, query) => {
  const ticket = await ticketRepository.findTicketById(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }
  return reviewRepository.findReviewsByTicket(ticketId, query);
};

export const getReviewsByUser = async (userId, query) => {
  return reviewRepository.findReviewsByUser(userId, query);
};

export const updateReview = async (id, userId, reviewData) => {
  if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  try {
    return await reviewRepository.updateReview(id, userId, reviewData);
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error(
        "Review not found or you don't have permission to update it"
      );
    }
    throw error;
  }
};

export const deleteReview = async (id, userId) => {
  try {
    return await reviewRepository.deleteReview(id, userId);
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error(
        "Review not found or you don't have permission to delete it"
      );
    }
    throw error;
  }
};
