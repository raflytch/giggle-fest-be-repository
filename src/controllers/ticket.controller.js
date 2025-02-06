import {
  createTicketService,
  getAllTicketsService,
  getTicketByIdService,
  updateTicketService,
  deleteTicketService,
  getTicketsByCategoryService,
  getTicketsByEventService,
} from "../services/ticket.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { uploadImage } from "../libs/imagekit.js";

export const createTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    const imageUrl = req.file ? await uploadImage(req.file) : null;

    const ticketData = {
      name: req.body.name,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      eventId: Number(req.body.eventId),
      categoryId: Number(req.body.categoryId),
      artist: req.body.artist,
      imageUrl,
      userId: req.user.id,
    };

    const ticket = await createTicketService(ticketData);
    return successResponse(res, ticket, "Ticket created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const queryParams = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      search: req.query.search,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      artist: req.query.artist,
      eventId: req.query.eventId ? parseInt(req.query.eventId) : undefined,
      categoryId: req.query.categoryId
        ? parseInt(req.query.categoryId)
        : undefined,
    };

    const tickets = await getAllTicketsService(queryParams);
    return successResponse(res, tickets);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await getTicketByIdService(parseInt(req.params.id));
    return successResponse(res, ticket);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    const imageUrl = req.file ? await uploadImage(req.file) : undefined;

    const updateData = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.price && { price: Number(req.body.price) }),
      ...(req.body.quantity && { quantity: Number(req.body.quantity) }),
      ...(req.body.artist && { artist: req.body.artist }),
      ...(imageUrl && { imageUrl }),
    };

    const ticket = await updateTicketService(
      parseInt(req.params.id),
      updateData
    );
    return successResponse(res, ticket, "Ticket updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const deleteTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }
    await deleteTicketService(parseInt(req.params.id));
    return successResponse(res, null, "Ticket deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getTicketsByCategory = async (req, res) => {
  try {
    const tickets = await getTicketsByCategoryService(
      parseInt(req.params.categoryId)
    );
    return successResponse(res, tickets);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getTicketsByEvent = async (req, res) => {
  try {
    const tickets = await getTicketsByEventService(
      parseInt(req.params.eventId)
    );
    return successResponse(res, tickets);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
