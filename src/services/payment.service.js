import { randomBytes } from "crypto";
import * as paymentRepository from "../repositories/payment.repository.js";
import * as ticketRepository from "../repositories/ticket.repository.js";
import { snap } from "../libs/midtrans.config.js";

export const generateOrderId = () => {
  return `ORDER-${randomBytes(5).toString("hex").toUpperCase()}`;
};

export const initializePayment = async (userId, { ticketId, quantity }) => {
  const ticket = await ticketRepository.findTicketById(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (ticket.quantity < quantity) {
    throw new Error("Not enough tickets available");
  }

  const amount = ticket.price * quantity;
  const orderId = generateOrderId();

  const transactionDetails = {
    order_id: orderId,
    gross_amount: amount,
  };

  const transactionToken = await snap.createTransaction({
    transaction_details: transactionDetails,
    item_details: [
      {
        id: ticketId,
        price: ticket.price,
        quantity: quantity,
        name: ticket.name,
        category: ticket.category.name,
      },
    ],
  });

  const payment = await paymentRepository.createPayment({
    ticketId,
    userId,
    amount,
    status: "pending",
    orderId,
  });

  return {
    payment,
    transactionToken: transactionToken.token,
    redirectUrl: transactionToken.redirect_url,
  };
};

export const handlePaymentNotification = async (notification) => {
  try {
    const payment = await paymentRepository.findPaymentByOrderId(
      notification.order_id
    );
    if (!payment) {
      throw new Error("Payment not found");
    }

    let paymentStatus;
    if (notification.transaction_status === "capture") {
      if (notification.fraud_status === "challenge") {
        paymentStatus = "challenge";
      } else if (notification.fraud_status === "accept") {
        paymentStatus = "success";
      }
    } else if (notification.transaction_status === "settlement") {
      paymentStatus = "success";
    } else if (
      notification.transaction_status === "cancel" ||
      notification.transaction_status === "deny" ||
      notification.transaction_status === "expire"
    ) {
      paymentStatus = "failed";
    } else if (notification.transaction_status === "pending") {
      paymentStatus = "pending";
    }

    const updatedPayment = await paymentRepository.updatePaymentStatus(
      notification.order_id,
      paymentStatus
    );
    return updatedPayment;
  } catch (error) {
    console.error("Payment notification error:", error);
    throw new Error("Failed to process payment notification: " + error.message);
  }
};

export const getAllPayments = async (query) => {
  return paymentRepository.findAllPayments(query);
};

export const getPaymentById = async (id, userId = null) => {
  const payment = await paymentRepository.findPaymentById(id, userId);
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};

export const getUserPaymentHistory = async (userId, query) => {
  return paymentRepository.findAllPayments({ ...query, userId });
};
