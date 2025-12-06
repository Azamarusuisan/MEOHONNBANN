import { prisma } from '../repositories/prisma';
import { Prisma } from '@prisma/client';

interface GetStoresParams {
  page: number;
  limit: number;
  search?: string;
}

export const storesService = {
  async getStores(params: GetStoresParams) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.StoreWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { customers: true },
          },
        },
      }),
      prisma.store.count({ where }),
    ]);

    return {
      data: stores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getStore(id: string) {
    return prisma.store.findUnique({
      where: { id },
      include: {
        _count: {
          select: { customers: true },
        },
      },
    });
  },

  async createStore(data: Prisma.StoreCreateInput) {
    return prisma.store.create({
      data,
      include: {
        _count: {
          select: { customers: true },
        },
      },
    });
  },

  async updateStore(id: string, data: Prisma.StoreUpdateInput) {
    try {
      return await prisma.store.update({
        where: { id },
        data,
        include: {
          _count: {
            select: { customers: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  async deleteStore(id: string) {
    try {
      await prisma.store.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
