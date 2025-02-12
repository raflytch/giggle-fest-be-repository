import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPayment = async (data) => {
  return prisma.payment.create({
    data: {
      amount: data.amount,
      originalAmount: data.originalAmount,
      discount: data.discount,
      status: data.status,
      orderId: data.orderId,
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
          email: true,
        },
      },
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};

export const findAllPayments = async ({
  page = 1,
  limit = 10,
  userId = null,
}) => {
  const skip = (page - 1) * Number(limit);
  const where = userId ? { userId } : {};

  const [total, payments] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ticket: {
          include: {
            event: true,
            category: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    }),
  ]);

  return {
    payments,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const findPaymentById = async (id, userId = null) => {
  const where = userId ? { id, userId } : { id };
  return prisma.payment.findFirst({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};

export const findPaymentByOrderId = async (orderId) => {
  return prisma.payment.findFirst({
    where: { orderId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};

export const updatePaymentStatus = async (orderId, status) => {
  return prisma.payment.update({
    where: { orderId },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ticket: {
        include: {
          event: true,
          category: true,
        },
      },
    },
  });
};
