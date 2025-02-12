import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createReview = async (data) => {
  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      user: {
        connect: {
          id: data.userId,
        },
      },
      ticket: {
        connect: {
          id: data.ticketId,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      ticket: {
        select: {
          id: true,
          name: true,
          event: true,
          category: true,
        },
      },
    },
  });
};

export const findAllReviews = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * Number(limit);

  const [total, reviews] = await Promise.all([
    prisma.review.count(),
    prisma.review.findMany({
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        ticket: {
          select: {
            id: true,
            name: true,
            event: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(total / Number(limit));

  return {
    reviews,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
  };
};

export const findReviewById = async (id) => {
  return prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      ticket: {
        select: {
          id: true,
          name: true,
          event: true,
          category: true,
        },
      },
    },
  });
};

export const findReviewsByTicket = async (
  ticketId,
  { page = 1, limit = 10 }
) => {
  const skip = (page - 1) * Number(limit);

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where: { ticketId } }),
    prisma.review.findMany({
      where: { ticketId },
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        ticket: {
          select: {
            id: true,
            name: true,
            event: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(total / Number(limit));

  return {
    reviews,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
  };
};

export const findReviewsByUser = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * Number(limit);

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where: { userId } }),
    prisma.review.findMany({
      where: { userId },
      skip,
      take: Number(limit),
      include: {
        ticket: {
          select: {
            id: true,
            name: true,
            event: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(total / Number(limit));

  return {
    reviews,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
  };
};

export const updateReview = async (id, userId, data) => {
  return prisma.review.update({
    where: {
      id,
      userId,
    },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      ticket: {
        select: {
          id: true,
          name: true,
          event: true,
          category: true,
        },
      },
    },
  });
};

export const deleteReview = async (id, userId) => {
  return prisma.review.delete({
    where: {
      id,
      userId,
    },
  });
};
