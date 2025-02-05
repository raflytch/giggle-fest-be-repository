import * as eventRepository from "../repositories/event.repository.js";
import { uploadImage } from "../libs/imagekit.js";

export const createEventService = async (data, file) => {
  if (file) {
    const imageUrl = await uploadImage(file);
    data.imageUrl = imageUrl;
  }

  return eventRepository.createEvent(data);
};

export const getAllEventsService = async (query) => {
  const { page = 1, limit = 10, search, category, startDate, endDate } = query;
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.tickets = {
      some: {
        categoryId: parseInt(category),
      },
    };
  }

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const [events, total] = await Promise.all([
    eventRepository.findAllEvents(skip, take, where),
    eventRepository.countEvents(where),
  ]);

  return {
    events,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventByIdService = async (id) => {
  return eventRepository.findEventById(id);
};

export const updateEventService = async (id, data, file) => {
  if (file) {
    const imageUrl = await uploadImage(file);
    data.imageUrl = imageUrl;
  }

  return eventRepository.updateEvent(id, data);
};

export const deleteEventService = async (id) => {
  return eventRepository.deleteEvent(id);
};
