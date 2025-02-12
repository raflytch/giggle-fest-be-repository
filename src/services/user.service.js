import bcrypt from "bcrypt";
import crypto from "crypto";
import * as userRepository from "../repositories/user.repository.js";
import { generateToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/email.service.js";

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

export const resendVerification = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User is already verified");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  await userRepository.updateUser(user.id, {
    verificationToken,
    updatedAt: new Date(),
  });

  await sendVerificationEmail(user.email, verificationToken);

  return { message: "Verification email sent successfully" };
};

export const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
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

export const updateUserById = async (id, data) => {
  const allowedFields = ["name", "age", "phoneNumber"];
  const invalidFields = Object.keys(data).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length > 0) {
    throw new Error(
      `Invalid fields provided: ${invalidFields.join(
        ", "
      )}. Only name, age, and phoneNumber can be updated.`
    );
  }

  const existingUser = await userRepository.findUserById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }

  return userRepository.updateUser(id, data);
};

export const deleteUserById = async (id) => {
  try {
    await userRepository.deleteUser(id);
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete user: " + error.message);
  }
};

export const getAllUsers = async (queryParams) => {
  return userRepository.findAllUsers(queryParams);
};

export const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
