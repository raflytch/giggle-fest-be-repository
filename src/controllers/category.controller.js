import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createCategory = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const category = await createCategoryService(req.body);
    return successResponse(res, category, "Category created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const queryParams = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      search: req.query.search,
    };

    const categories = await getAllCategoriesService(queryParams);
    return successResponse(res, categories);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await getCategoryByIdService(parseInt(req.params.id));
    return successResponse(res, category);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    const category = await updateCategoryService(
      parseInt(req.params.id),
      req.body
    );
    return successResponse(res, category, "Category updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Unauthorized", 403);
    }

    await deleteCategoryService(parseInt(req.params.id));
    return successResponse(res, null, "Category deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
