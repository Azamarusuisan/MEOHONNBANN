import { prisma } from '../repositories/prisma.js';
import { Prisma } from '@prisma/client';

interface GetSchedulesParams {
  page: number;
  limit: number;
  storeId?: string;
  startDate?: string;
  endDate?: string;
}

export const schedulesService = {
  async getSchedules(params: GetSchedulesParams) {
    const { page, limit, storeId, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PostingScheduleWhereInput = {};

    if (storeId) {
      where.storeId = storeId;
    }

    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) {
        where.scheduledAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.scheduledAt.lte = new Date(endDate);
      }
    }

    const [schedules, total] = await Promise.all([
      prisma.postingSchedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'asc' },
        include: {
          store: { select: { id: true, name: true } },
        },
      }),
      prisma.postingSchedule.count({ where }),
    ]);

    return {
      data: schedules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getSchedule(id: string) {
    return prisma.postingSchedule.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async createSchedule(data: Prisma.PostingScheduleCreateInput) {
    return prisma.postingSchedule.create({
      data,
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async updateSchedule(id: string, data: Prisma.PostingScheduleUpdateInput) {
    try {
      return await prisma.postingSchedule.update({
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

  async deleteSchedule(id: string) {
    try {
      await prisma.postingSchedule.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
