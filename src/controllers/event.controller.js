import * as eventService from "../services/event.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const event = await eventService.createEventService(req.body, req.file);
    return successResponse(res, event, "Event created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const result = await eventService.getAllEventsService(req.query);
    return successResponse(res, result);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventByIdService(req.params.id);
    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }
    return successResponse(res, event);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const event = await eventService.updateEventService(
      req.params.id,
      req.body,
      req.file
    );
    return successResponse(res, event, "Event updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    await eventService.deleteEventService(req.params.id);
    return successResponse(res, null, "Event deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
