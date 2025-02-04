import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.repository.js";
import { generateToken } from "../utils/token.js";

// Register a new user
export const register = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const auth = await userRepository.createAuth({
    email: userData.email,
    password: hashedPassword,
    phoneNumber: userData.phoneNumber,
  });

  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
    authId: auth.id,
  });

  const { password, ...userWithoutPassword } = user;
  const token = generateToken(user);

  return { user: userWithoutPassword, token };
};

// Login a user
export const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid password");
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
export const getAllUsers = () => userRepository.findAllUsers();

// Get user by id
export const getUserById = (id) => userRepository.findUserById(id);
