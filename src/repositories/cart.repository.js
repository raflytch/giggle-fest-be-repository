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

export const findCartItem = async (userId, ticketId) => {
  return prisma.cart.findFirst({
    where: {
      userId,
      ticketId,
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

export const updateCartItem = async (id, data) => {
  return prisma.cart.update({
    where: { id },
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

export const deleteCartItem = async (id) => {
  return prisma.cart.delete({
    where: { id },
  });
};

export const clearUserCart = async (userId) => {
  return prisma.cart.deleteMany({
    where: { userId },
  });
};
