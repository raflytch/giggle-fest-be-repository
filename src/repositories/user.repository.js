import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = (data) => prisma.user.create({ data });

export const createAuth = (data) => prisma.auth.create({ data });

export const findUserByEmail = (email) =>
  prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      age: true,
      phoneNumber: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      authId: true,
    },
  });

export const findUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      age: true,
      phoneNumber: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      authId: true,
    },
  });

export const updateUser = (id, data) =>
  prisma.user.update({ where: { id }, data });

export const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      authId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.$transaction(async (tx) => {
    await tx.notification.deleteMany({
      where: { userId: user.id },
    });

    await tx.review.deleteMany({
      where: { userId: user.id },
    });

    await tx.cart.deleteMany({
      where: { userId: user.id },
    });

    await tx.payment.deleteMany({
      where: { userId: user.id },
    });

    await tx.user.delete({
      where: { id: user.id },
    });

    if (user.authId) {
      await tx.auth.delete({
        where: { id: user.authId },
      });
    }
  });
};

export const findAllUsers = async ({ page = 1, limit = 10, search = "" }) => {
  const skip = (page - 1) * limit;

  const where = {
    email: {
      contains: search,
      mode: "insensitive",
    },
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        authId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    metadata: {
      total,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    },
  };
};

export const findUserByVerificationToken = (verificationToken) =>
  prisma.user.findUnique({ where: { verificationToken } });

export const findUserByResetToken = (resetToken) =>
  prisma.user.findFirst({
    where: { resetToken },
  });
