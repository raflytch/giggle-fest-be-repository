import { PrismaClient } from "@prisma/client";
import {
  createTicket,
  findAllTickets,
  findTicketById,
  updateTicket,
  deleteTicket,
  findTicketsByCategory,
  findTicketsByEvent,
} from "../repositories/ticket.repository.js";

const prisma = new PrismaClient();

export const createTicketService = async (data) => {
  const event = await prisma.event.findUnique({
    where: { id: data.eventId },
  });
  if (!event) throw new Error("Event not found");

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) throw new Error("Category not found");

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });
  if (!user) throw new Error("User not found");

  return await createTicket(data);
};

export const getAllTicketsService = async (params) => {
  if (params.eventId) {
    const event = await prisma.event.findUnique({
      where: { id: Number(params.eventId) },
    });
    if (!event) throw new Error("Event not found");
  }

  if (params.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: Number(params.categoryId) },
    });
    if (!category) throw new Error("Category not found");
  }

  return await findAllTickets(params);
};

export const getTicketByIdService = async (id) => {
  const ticket = await findTicketById(id);
  if (!ticket) throw new Error("Ticket not found");
  return ticket;
};

export const updateTicketService = async (id, data) => {
  const ticket = await findTicketById(id);
  if (!ticket) throw new Error("Ticket not found");
  return await updateTicket(id, data);
};

export const deleteTicketService = async (id) => {
  const ticket = await findTicketById(id);
  if (!ticket) throw new Error("Ticket not found");
  return await deleteTicket(id);
};

export const getTicketsByCategoryService = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) throw new Error("Category not found");

  return await findTicketsByCategory(categoryId);
};

export const getTicketsByEventService = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) throw new Error("Event not found");

  return await findTicketsByEvent(eventId);
};
