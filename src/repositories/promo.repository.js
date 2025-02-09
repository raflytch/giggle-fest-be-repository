import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPromoCode = async (data) => {
  return prisma.promoCode.create({
    data: {
      code: data.code.toUpperCase(),
      discount: data.discount,
      validFrom: new Date(data.validFrom),
      validTo: new Date(data.validTo),
    },
  });
};

export const findAllPromoCodes = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * Number(limit);

  const [total, promoCodes] = await Promise.all([
    prisma.promoCode.count(),
    prisma.promoCode.findMany({
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    promoCodes,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const findPromoCodeByCode = async (code) => {
  return prisma.promoCode.findUnique({
    where: {
      code: code.toUpperCase(),
    },
  });
};

export const findPromoCodeById = async (id) => {
  return prisma.promoCode.findUnique({
    where: { id },
  });
};

export const updatePromoCode = async (id, data) => {
  const updateData = {
    ...data,
    code: data.code?.toUpperCase(),
    validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
    validTo: data.validTo ? new Date(data.validTo) : undefined,
  };

  return prisma.promoCode.update({
    where: { id },
    data: updateData,
  });
};

export const deletePromoCode = async (id) => {
  return prisma.promoCode.delete({
    where: { id },
  });
};
