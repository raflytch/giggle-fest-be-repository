import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTicket = async (data) => {
  return await prisma.ticket.create({
    data,
    include: {
      event: true,
      category: true,
    },
  });
};

export const findAllTickets = async ({
  page,
  limit,
  search,
  minPrice,
  maxPrice,
  artist,
  eventId,
  categoryId,
}) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { artist: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice && { gte: minPrice }),
      ...(maxPrice && { lte: maxPrice }),
    };
  }

  if (artist) {
    where.artist = {
      contains: artist,
      mode: "insensitive",
    };
  }

  if (eventId) {
    where.eventId = eventId;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [total, tickets] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        event: true,
        category: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    tickets,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const findTicketById = async (id) => {
  return await prisma.ticket.findUnique({
    where: { id },
    include: {
      event: true,
      category: true,
    },
  });
};

export const updateTicket = async (id, data) => {
  return await prisma.ticket.update({
    where: { id },
    data,
    include: {
      event: true,
      category: true,
    },
  });
};

export const deleteTicket = async (id) => {
  return await prisma.ticket.delete({
    where: { id },
  });
};

export const findTicketsByCategory = async (categoryId) => {
  return await prisma.ticket.findMany({
    where: { categoryId },
    include: {
      event: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findTicketsByEvent = async (eventId) => {
  return await prisma.ticket.findMany({
    where: { eventId },
    include: {
      event: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
