import * as notificationService from "../services/notification.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createNotification = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    const notification = await notificationService.createNotification(req.body);
    return successResponse(
      res,
      notification,
      "Notification created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(
      req.user.id,
      req.query
    );
    return successResponse(res, notifications);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      Number(req.params.id),
      req.user.id
    );
    return successResponse(res, notification);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const markAsUnread = async (req, res) => {
  try {
    const notification = await notificationService.markAsUnread(
      Number(req.params.id),
      req.user.id
    );
    return successResponse(res, notification);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    return successResponse(res, null, "All notifications marked as read");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    await notificationService.deleteNotification(Number(req.params.id));
    return successResponse(res, null, "Notification deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
