import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEvent = async (data) => {
  return prisma.event.create({ data });
};

export const findAllEvents = async (skip, take, where) => {
  return prisma.event.findMany({
    skip,
    take,
    where,
    include: {
      tickets: true,
    },
  });
};

export const countEvents = async (where) => {
  return prisma.event.count({ where });
};

export const findEventById = async (id) => {
  return prisma.event.findUnique({
    where: { id: parseInt(id) },
    include: {
      tickets: true,
    },
  });
};

export const updateEvent = async (id, data) => {
  return prisma.event.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteEvent = async (id) => {
  return prisma.event.delete({
    where: { id: parseInt(id) },
  });
};
