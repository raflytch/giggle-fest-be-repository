import { randomBytes } from "crypto";
import * as paymentRepository from "../repositories/payment.repository.js";
import * as ticketRepository from "../repositories/ticket.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import { snap, core } from "../libs/midtrans.config.js";

export const generateOrderId = () => {
  return `ORDER-${randomBytes(5).toString("hex").toUpperCase()}`;
};

export const initializePayment = async (userId, { ticketId, quantity }) => {
  const [ticket, user] = await Promise.all([
    ticketRepository.findTicketById(ticketId),
    userRepository.findUserById(userId),
  ]);

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (!user) {
    throw new Error("User not found");
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

  const customerDetails = {
    first_name: user.name.split(" ")[0],
    last_name: user.name.split(" ").slice(1).join(" ") || "",
    email: user.email,
    phone: user.phoneNumber,
  };

  const transactionToken = await snap.createTransaction({
    transaction_details: transactionDetails,
    customer_details: customerDetails,
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

export const checkAndUpdatePaymentStatus = async (orderId) => {
  try {
    const transactionStatus = await core.transaction.status(orderId);
    let paymentStatus;

    if (transactionStatus.transaction_status === "capture") {
      paymentStatus =
        transactionStatus.fraud_status === "challenge"
          ? "challenge"
          : "success";
    } else if (transactionStatus.transaction_status === "settlement") {
      paymentStatus = "success";
    } else if (
      ["cancel", "deny", "expire"].includes(
        transactionStatus.transaction_status
      )
    ) {
      paymentStatus = "failed";
    } else {
      paymentStatus = "pending";
    }

    const updatedPayment = await paymentRepository.updatePaymentStatus(
      orderId,
      paymentStatus
    );
    return updatedPayment;
  } catch (error) {
    console.error("Payment status check error:", error);
    throw new Error("Failed to check payment status: " + error.message);
  }
};

export const getAllPayments = async (query) => {
  const payments = await paymentRepository.findAllPayments(query);

  await Promise.all(
    payments.payments.map(async (payment) => {
      if (payment.status === "pending") {
        try {
          await checkAndUpdatePaymentStatus(payment.orderId);
        } catch (error) {
          console.error(
            `Failed to update payment status for order ${payment.orderId}:`,
            error
          );
        }
      }
    })
  );

  return paymentRepository.findAllPayments(query);
};

export const getPaymentById = async (id, userId = null) => {
  const payment = await paymentRepository.findPaymentById(id, userId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "pending") {
    try {
      return await checkAndUpdatePaymentStatus(payment.orderId);
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  }

  return payment;
};

export const getUserPaymentHistory = async (userId, query) => {
  const payments = await paymentRepository.findAllPayments({
    ...query,
    userId,
  });

  await Promise.all(
    payments.payments.map(async (payment) => {
      if (payment.status === "pending") {
        try {
          await checkAndUpdatePaymentStatus(payment.orderId);
        } catch (error) {
          console.error(
            `Failed to update payment status for order ${payment.orderId}:`,
            error
          );
        }
      }
    })
  );

  return paymentRepository.findAllPayments({ ...query, userId });
};
