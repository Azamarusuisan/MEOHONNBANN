import { prisma } from '../repositories/prisma';
import { Prisma } from '@prisma/client';

interface GetMetricsParams {
  page: number;
  limit: number;
  storeId?: string;
  startDate?: string;
  endDate?: string;
}

export const metricsService = {
  async getMetrics(params: GetMetricsParams) {
    const { page, limit, storeId, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.GbpDailyMetricWhereInput = {};

    if (storeId) {
      where.storeId = storeId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const [metrics, total] = await Promise.all([
      prisma.gbpDailyMetric.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          store: { select: { id: true, name: true } },
        },
      }),
      prisma.gbpDailyMetric.count({ where }),
    ]);

    return {
      data: metrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getMetric(id: string) {
    return prisma.gbpDailyMetric.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async createMetric(data: Prisma.GbpDailyMetricUncheckedCreateInput) {
    return prisma.gbpDailyMetric.create({
      data,
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async updateMetric(id: string, data: Prisma.GbpDailyMetricUpdateInput) {
    try {
      return await prisma.gbpDailyMetric.update({
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

  async deleteMetric(id: string) {
    try {
      await prisma.gbpDailyMetric.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
