import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNotification = async (data) => {
  if (data.userId === "all") {
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    const notifications = users.map((user) => ({
      userId: user.id,
      message: data.message,
    }));

    return prisma.notification.createMany({
      data: notifications,
    });
  }

  return prisma.notification.create({
    data,
  });
};

export const findNotificationsByUser = async (
  userId,
  { page = 1, limit = 10 }
) => {
  const skip = (page - 1) * Number(limit);

  const [total, notifications] = await Promise.all([
    prisma.notification.count({
      where: { userId },
    }),
    prisma.notification.findMany({
      where: { userId },
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    notifications,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const updateNotificationStatus = async (id, userId, data) => {
  return prisma.notification.update({
    where: { id, userId },
    data,
  });
};

export const findNotificationById = async (id) => {
  return prisma.notification.findUnique({
    where: { id },
  });
};

export const deleteNotification = async (id) => {
  return prisma.notification.delete({
    where: { id },
  });
};

export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};
