import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (data) => {
  return await prisma.category.create({
    data,
  });
};

export const findAllCategories = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [total, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    categories,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const findCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const updateCategory = async (id, data) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id },
  });
};
