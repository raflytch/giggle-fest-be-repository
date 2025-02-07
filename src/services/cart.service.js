import * as cartRepository from "../repositories/cart.repository.js";
import * as ticketRepository from "../repositories/ticket.repository.js";

export const addToCart = async (userId, { ticketId, quantity }) => {
  const ticket = await ticketRepository.findTicketById(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (ticket.quantity < quantity) {
    throw new Error("Not enough tickets available");
  }

  const existingCartItem = await cartRepository.findCartItemByTicket(
    userId,
    ticketId
  );
  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + quantity;
    if (ticket.quantity < newQuantity) {
      throw new Error("Not enough tickets available");
    }

    return cartRepository.updateCartItem(existingCartItem.id, userId, {
      quantity: newQuantity,
    });
  }

  return cartRepository.createCartItem({
    userId,
    ticketId,
    quantity,
  });
};

export const getCartByUser = async (userId) => {
  const cartItems = await cartRepository.findCartByUser(userId);

  const total = cartItems.reduce((sum, item) => {
    return sum + item.ticket.price * item.quantity;
  }, 0);

  return {
    items: cartItems,
    total,
    totalItems: cartItems.length,
  };
};

export const updateCartQuantity = async (userId, cartId, quantity) => {
  const cartItem = await cartRepository.findCartItemById(cartId, userId);
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  const ticket = await ticketRepository.findTicketById(cartItem.ticketId);
  if (ticket.quantity < quantity) {
    throw new Error("Not enough tickets available");
  }

  return cartRepository.updateCartItem(cartId, userId, { quantity });
};

export const removeFromCart = async (userId, cartId) => {
  const cartItem = await cartRepository.findCartItemById(cartId, userId);
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return cartRepository.deleteCartItem(cartId, userId);
};

export const checkout = async (userId) => {
  const cart = await getCartByUser(userId);
  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const item of cart.items) {
    const ticket = await ticketRepository.findTicketById(item.ticketId);
    if (ticket.quantity < item.quantity) {
      throw new Error(`Not enough tickets available for ${ticket.name}`);
    }
  }

  const checkoutData = {
    userId,
    items: cart.items.map((item) => ({
      ticketId: item.ticketId,
      quantity: item.quantity,
      price: item.ticket.price,
      subtotal: item.ticket.price * item.quantity,
    })),
    total: cart.total,
    status: "pending",
  };

  return checkoutData;
};
