import { prisma } from '../repositories/prisma';
import { Prisma } from '@prisma/client';

interface GetSettingsParams {
  page: number;
  limit: number;
}

export const settingsService = {
  async getSettings(params: GetSettingsParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.SettingWhereInput = {};

    const [settings, total] = await Promise.all([
      prisma.setting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.setting.count({ where }),
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
    return prisma.setting.findUnique({
      where: { id },
    });
  },

  async createSetting(data: Prisma.SettingCreateInput) {
    return prisma.setting.create({
      data,
    });
  },

  async updateSetting(id: string, data: Prisma.SettingUpdateInput) {
    try {
      return await prisma.setting.update({
        where: { id },
        data,
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
      await prisma.setting.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
