import * as notificationRepository from "../repositories/notification.repository.js";

export const createNotification = async (notificationData) => {
  return notificationRepository.createNotification(notificationData);
};

export const getUserNotifications = async (userId, query) => {
  return notificationRepository.findNotificationsByUser(userId, query);
};

export const markAsRead = async (id, userId) => {
  return notificationRepository.updateNotificationStatus(id, userId, {
    isRead: true,
  });
};

export const markAsUnread = async (id, userId) => {
  return notificationRepository.updateNotificationStatus(id, userId, {
    isRead: false,
  });
};

export const markAllAsRead = async (userId) => {
  return notificationRepository.markAllAsRead(userId);
};

export const deleteNotification = async (id) => {
  return notificationRepository.deleteNotification(id);
};
