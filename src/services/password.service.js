import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.repository.js";
import { sendResetOTPEmail } from "../utils/email.service.js";

export const initPasswordReset = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  await userRepository.updateUser(user.id, {
    resetToken,
    resetOTP: null,
    resetOTPExpires: null,
  });

  return resetToken;
};

export const generateAndSendOTP = async (token) => {
  try {
    const user = await userRepository.findUserByResetToken(token);

    if (!user) {
      throw new Error("Invalid reset token");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await userRepository.updateUser(user.id, {
      resetOTP: await bcrypt.hash(otp, 10),
      resetOTPExpires: otpExpires,
    });

    await sendResetOTPEmail(user.email, otp);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw error;
  }
};

export const verifyOTP = async (token, otp) => {
  try {
    const user = await userRepository.findUserByResetToken(token);

    if (!user) {
      throw new Error("Invalid reset token");
    }

    if (!user.resetOTP || !user.resetOTPExpires) {
      throw new Error("OTP not generated");
    }

    if (user.resetOTPExpires < new Date()) {
      throw new Error("OTP has expired");
    }

    const isValidOTP = await bcrypt.compare(otp, user.resetOTP);
    if (!isValidOTP) {
      throw new Error("Invalid OTP");
    }

    return true;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw error;
  }
};

export const resetPassword = async (token, otp, newPassword) => {
  try {
    const user = await userRepository.findUserByResetToken(token);

    if (!user) {
      throw new Error("Invalid reset token");
    }

    if (!user.resetOTP || !user.resetOTPExpires) {
      throw new Error("OTP not generated");
    }

    if (user.resetOTPExpires < new Date()) {
      throw new Error("OTP has expired");
    }

    const isValidOTP = await bcrypt.compare(otp, user.resetOTP);
    if (!isValidOTP) {
      throw new Error("Invalid OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetOTP: null,
      resetOTPExpires: null,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw error;
  }
};
