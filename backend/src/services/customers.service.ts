import { prisma } from '../repositories/prisma.js';
import { Prisma } from '@prisma/client';

interface GetCustomersParams {
  page: number;
  limit: number;
  search?: string;
  storeId?: string;
}

export const customersService = {
  async getCustomers(params: GetCustomersParams) {
    const { page, limit, search, storeId } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { lineUserId: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (storeId) {
      where.storeId = storeId;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: { select: { id: true, name: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getCustomer(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true } },
        interactions: {
          orderBy: { interactedAt: 'desc' },
          take: 10,
        },
      },
    });
  },

  async createCustomer(data: Prisma.CustomerCreateInput) {
    return prisma.customer.create({
      data,
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async updateCustomer(id: string, data: Prisma.CustomerUpdateInput) {
    try {
      return await prisma.customer.update({
        where: { id },
        data,
        include: {
          store: { select: { id: true, name: true } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  async deleteCustomer(id: string) {
    try {
      await prisma.customer.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
