import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findCartByUser = async (userId) => {
  return prisma.cart.findMany({
    where: { userId },
    include: {
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findCartItemById = async (id, userId) => {
  return prisma.cart.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};

export const findCartItemByTicket = async (userId, ticketId) => {
  return prisma.cart.findFirst({
    where: {
      userId,
      ticketId,
    },
    include: {
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};

export const createCartItem = async (data) => {
  return prisma.cart.create({
    data,
    include: {
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};

export const updateCartItem = async (id, userId, data) => {
  return prisma.cart.update({
    where: {
      id,
      userId,
    },
    data,
    include: {
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};

export const deleteCartItem = async (id, userId) => {
  return prisma.cart.delete({
    where: {
      id,
      userId,
    },
  });
};

export const clearUserCart = async (userId) => {
  return prisma.cart.deleteMany({
    where: { userId },
  });
};
