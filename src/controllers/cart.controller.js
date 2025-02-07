import * as cartService from "../services/cart.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const addToCart = async (req, res) => {
  try {
    const cartItem = await cartService.addToCart(req.user.id, req.body);
    return successResponse(
      res,
      cartItem,
      "Item added to cart successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getCartByUser = async (req, res) => {
  try {
    const cart = await cartService.getCartByUser(req.user.id);
    return successResponse(res, cart);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const cartItem = await cartService.updateCartQuantity(
      req.user.id,
      Number(req.params.id),
      Number(req.body.quantity)
    );
    return successResponse(res, cartItem, "Cart updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    await cartService.removeFromCart(req.user.id, Number(req.params.id));
    return successResponse(res, null, "Item removed from cart successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const checkout = async (req, res) => {
  try {
    const checkoutData = await cartService.checkout(req.user.id);
    return successResponse(
      res,
      checkoutData,
      "Checkout initialized successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
