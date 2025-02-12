import * as passwordService from "../services/password.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const initPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const token = await passwordService.initPasswordReset(email);
    return successResponse(
      res,
      { token },
      "Password reset initiated. Please check your email for next steps."
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const generateOTP = async (req, res) => {
  try {
    const { token } = req.body;
    await passwordService.generateAndSendOTP(token);
    return successResponse(res, null, "OTP has been sent to your email");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { token, otp } = req.body;
    await passwordService.verifyOTP(token, otp);
    return successResponse(res, null, "OTP verified successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, otp, password } = req.body;
    await passwordService.resetPassword(token, otp, password);
    return successResponse(res, null, "Password has been reset successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
