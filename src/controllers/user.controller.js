import * as userService from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const registerUser = async (req, res) => {
  try {
    const result = await userService.register(req.body);
    return successResponse(res, result, "User registered successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return successResponse(res, result, "Login successful");
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const result = await userService.updateUserById(
      parseInt(req.params.id),
      req.body
    );
    return successResponse(res, result, "User updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteUserDetails = async (req, res) => {
  try {
    await userService.deleteUserById(parseInt(req.params.id));
    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllUserDetails = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
