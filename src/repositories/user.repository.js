import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a new user
export const createUser = (data) => prisma.user.create({ data });

// Create a new auth
export const createAuth = (data) => prisma.auth.create({ data });

// Find user by email
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

// Find user by id
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

// Update user
export const updateUser = (id, data) =>
  prisma.user.update({ where: { id }, data });

// Delete user
export const deleteUser = (id) => prisma.user.delete({ where: { id } });

// Find all users
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

// Find user by verification token
export const findUserByVerificationToken = (verificationToken) =>
  prisma.user.findUnique({ where: { verificationToken } });

// Find user by reset token
export const findUserByResetToken = (resetToken) =>
  prisma.user.findFirst({
    where: { resetToken },
  });
