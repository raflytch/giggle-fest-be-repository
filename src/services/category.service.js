import {
  createCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
} from "../repositories/category.repository.js";

export const createCategoryService = async (data) => {
  return await createCategory(data);
};

export const getAllCategoriesService = async ({ page, limit, search }) => {
  return await findAllCategories({ page, limit, search });
};

export const getCategoryByIdService = async (id) => {
  const category = await findCategoryById(id);
  if (!category) throw new Error("Category not found");
  return category;
};

export const updateCategoryService = async (id, data) => {
  await getCategoryByIdService(id);
  return await updateCategory(id, data);
};

export const deleteCategoryService = async (id) => {
  await getCategoryByIdService(id);
  return await deleteCategory(id);
};
