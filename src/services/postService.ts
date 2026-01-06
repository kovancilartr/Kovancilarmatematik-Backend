import { Difficulty } from '@prisma/client';
import { prisma } from '../config/database';

interface CreatePostData {
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  category: string;
  tags?: string[];
  isPublished?: boolean;
  duration?: number;
  difficulty?: Difficulty;
  authorId: string;
}

interface UpdatePostData {
  title?: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  duration?: number;
  difficulty?: Difficulty;
}

interface PostFilters {
  category?: string;
  isPublished?: boolean;
  search?: string;
}

export const postService = {
  async getAllPosts(page: number = 1, limit: number = 10, filters: PostFilters = {}) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters.category) {
      where.category = filters.category;
    }
    
    if (filters.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getPostById(id: string) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  },

  async createPost(data: CreatePostData) {
    return await prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  },

  async updatePost(id: string, data: UpdatePostData) {
    try {
      return await prisma.post.update({
        where: { id },
        data,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      return null;
    }
  },

  async deletePost(id: string) {
    try {
      await prisma.post.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async incrementViewCount(id: string) {
    try {
      return await prisma.post.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });
    } catch (error) {
      return null;
    }
  },

  async getPostsByCategory(category: string, limit: number = 10) {
    return await prisma.post.findMany({
      where: {
        category,
        isPublished: true
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  },

  async getPopularPosts(limit: number = 10) {
    return await prisma.post.findMany({
      where: {
        isPublished: true
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }
};