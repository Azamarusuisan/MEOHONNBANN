import { prisma } from '../repositories/prisma';
import { Prisma } from '@prisma/client';

interface GetSettingsParams {
  page: number;
  limit: number;
  storeId?: string;
}

export const settingsService = {
  async getSettings(params: GetSettingsParams) {
    const { page, limit, storeId } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.SystemSettingWhereInput = {};

    if (storeId) {
      where.storeId = storeId;
    }

    const [settings, total] = await Promise.all([
      prisma.systemSetting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          store: { select: { id: true, name: true } },
        },
      }),
      prisma.systemSetting.count({ where }),
    ]);

    return {
      data: settings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getSetting(id: string) {
    return prisma.systemSetting.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async createSetting(data: Prisma.SystemSettingCreateInput) {
    return prisma.systemSetting.create({
      data,
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async updateSetting(id: string, data: Prisma.SystemSettingUpdateInput) {
    try {
      return await prisma.systemSetting.update({
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

  async deleteSetting(id: string) {
    try {
      await prisma.systemSetting.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
