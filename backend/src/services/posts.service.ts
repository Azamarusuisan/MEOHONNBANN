import { prisma } from '../repositories/prisma';
import { Prisma } from '@prisma/client';

interface GetPostsParams {
  page: number;
  limit: number;
  storeId?: string;
  status?: string;
}

export const postsService = {
  async getPosts(params: GetPostsParams) {
    const { page, limit, storeId, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.GbpPostWhereInput = {};

    if (storeId) {
      where.storeId = storeId;
    }

    if (status) {
      where.status = status;
    }

    const [posts, total] = await Promise.all([
      prisma.gbpPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
        include: {
          store: { select: { id: true, name: true } },
        },
      }),
      prisma.gbpPost.count({ where }),
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
    return prisma.gbpPost.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async createPost(data: Prisma.GbpPostCreateInput) {
    return prisma.gbpPost.create({
      data,
      include: {
        store: { select: { id: true, name: true } },
      },
    });
  },

  async updatePost(id: string, data: Prisma.GbpPostUpdateInput) {
    try {
      return await prisma.gbpPost.update({
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

  async deletePost(id: string) {
    try {
      await prisma.gbpPost.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  },
};
