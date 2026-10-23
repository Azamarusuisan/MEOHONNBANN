import { prisma } from '../repositories/prisma';
import { Prisma, ScheduleStatus } from '@prisma/client';

interface GetPostsParams {
  page: number;
  limit: number;
  storeId?: string;
  status?: ScheduleStatus;
}

export const postsService = {
  async getPosts(params: GetPostsParams) {
    const { page, limit, storeId, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (storeId || status) {
      where.schedules = { some: { storeId, status } };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          schedules: { include: { store: { select: { id: true, name: true } } } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getPost(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        schedules: { include: { store: { select: { id: true, name: true } } } },
      },
    });
  },

  async createPost(data: Prisma.PostCreateInput) {
    return prisma.post.create({
      data,
      include: {
        schedules: { include: { store: { select: { id: true, name: true } } } },
      },
    });
  },

  async updatePost(id: string, data: Prisma.PostUpdateInput) {
    try {
      return await prisma.post.update({
        where: { id },
        data,
        include: {
          schedules: { include: { store: { select: { id: true, name: true } } } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  async deletePost(id: string) {
    try {
      await prisma.post.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
