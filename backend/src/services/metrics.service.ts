import { prisma } from '../repositories/prisma.js';
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

    const where: Prisma.PerformanceMetricWhereInput = {};

    if (storeId) {
      where.storeId = storeId;
    }

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) {
        where.recordedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.recordedAt.lte = new Date(endDate);
      }
    }

    const [metrics, total] = await Promise.all([
      prisma.performanceMetric.findMany({
        where,
        skip,
        take: limit,
        orderBy: { recordedAt: 'desc' },
        include: {
          store: { select: { id: true, name: true } },
        },
      }),
      prisma.performanceMetric.count({ where }),
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
    return prisma.performanceMetric.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async createMetric(data: Prisma.PerformanceMetricCreateInput) {
    return prisma.performanceMetric.create({
      data,
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async updateMetric(id: string, data: Prisma.PerformanceMetricUpdateInput) {
    try {
      return await prisma.performanceMetric.update({
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
      await prisma.performanceMetric.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
