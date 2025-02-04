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
export const findUserById = (id) => prisma.user.findUnique({ where: { id } });

// Update user
export const updateUser = (id, data) =>
  prisma.user.update({ where: { id }, data });

// Delete user
export const deleteUser = (id) => prisma.user.delete({ where: { id } });

// Find all users
export const findAllUsers = () => prisma.user.findMany();

// Find user by verification token
export const findUserByVerificationToken = (verificationToken) =>
  prisma.user.findUnique({ where: { verificationToken } });
