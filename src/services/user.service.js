import bcrypt from "bcrypt";
import crypto from "crypto";
import * as userRepository from "../repositories/user.repository.js";
import { generateToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/email.service.js";

// Register a new user
export const register = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const auth = await userRepository.createAuth({
    email: userData.email,
    password: hashedPassword,
    phoneNumber: userData.phoneNumber,
  });

  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
    authId: auth.id,
    verificationToken,
    isVerified: false,
  });

  await sendVerificationEmail(userData.email, verificationToken);

  const { password, ...userWithoutPassword } = user;
  const token = generateToken(user);

  return { user: userWithoutPassword, token };
};

export const verifyEmail = async (verificationToken) => {
  const user = await userRepository.findUserByVerificationToken(
    verificationToken
  );

  if (!user) {
    throw new Error("Invalid verification token");
  }

  return userRepository.updateUser(user.id, {
    isVerified: true,
    verificationToken: null,
  });
};

// Login a user
export const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.hash(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  if (!user.isVerified) {
    throw new Error(
      "Please verify your email before logging in. Check your email for verification link."
    );
  }

  const { password: userPassword, ...userWithoutPassword } = user;
  const token = generateToken(user);

  return { user: userWithoutPassword, token };
};

// Update a user
export const updateUserById = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return userRepository.updateUser(id, data);
};

// Delete a user
export const deleteUserById = (id) => userRepository.deleteUser(id);

// Get all users
export const getAllUsers = async (queryParams) => {
  return userRepository.findAllUsers(queryParams);
};

// Get user by id
export const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
