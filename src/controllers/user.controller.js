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

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.resendVerification(email);
    return successResponse(
      res,
      result,
      "Verification email resent successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);

    // res.cookie("token", result.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 24 * 60 * 60 * 1000,
    //   path: "/",
    // });

    return successResponse(res, result, "Login successful");
  } catch (error) {
    let status = 401;
    if (error.message.includes("verify your email")) {
      status = 403;
    }
    return errorResponse(res, error.message, status);
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.id !== userId) {
      return errorResponse(
        res,
        "Unauthorized - Can only update own profile",
        403
      );
    }

    const result = await userService.updateUserById(userId, req.body);

    const {
      password,
      resetToken,
      resetOTP,
      resetOTPExpires,
      verificationToken,
      ...safeUser
    } = result;

    return successResponse(res, safeUser, "User updated successfully");
  } catch (error) {
    if (error.name === "ZodError") {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return errorResponse(res, errorMessage, 400);
    }
    return errorResponse(res, error.message, 400);
  }
};

export const deleteUserDetails = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    await userService.deleteUserById(parseInt(req.params.id));
    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllUserDetails = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const { page, limit, search } = req.query;

    const result = await userService.getAllUsers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || "",
    });

    return successResponse(
      res,
      {
        users: result.users,
        metadata: result.metadata,
      },
      "Users retrieved successfully"
    );
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

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userService.verifyEmail(token);

    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            padding: 40px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
          }
          .success-icon {
            color: #4CAF50;
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4a90e2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: #357abd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✓</div>
          <h1>Email Verified Successfully!</h1>
          <p>Your account has been verified. You can now log in to access all features.</p>
          <a href="${process.env.FRONTEND_URL}/login" class="button">Go to Login</a>
        </div>
      </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
