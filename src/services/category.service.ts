import { prisma } from '../config/database';

export const createCategory = async (data: { name: string; order: number; isPublished?: boolean; isPublic?: boolean; allowedUserIds?: string[] }) => {
  const { allowedUserIds, ...rest } = data;

  return prisma.category.create({
    data: {
      ...rest,
      allowedUsers: allowedUserIds ? {
        connect: allowedUserIds.map((id) => ({ id }))
      } : undefined
    },
    include: {
      allowedUsers: true
    }
  });
};

export const getAllCategories = async (user?: { id: string; role: string }) => {
  const where: any = {}; // Using any to avoid complex Prisma types import for now, or explicitly Prisma.CategoryWhereInput

  if (user?.role === 'ADMIN') {
    // Admin sees everything (Drafts, Private, Public)
  } else {
    // Students/Public see only published
    where.isPublished = true;
    where.OR = [
      { isPublic: true },
      ...(user ? [{ allowedUsers: { some: { id: user.id } } }] : [])
    ];
  }

  return prisma.category.findMany({
    where,
    orderBy: {
      order: 'asc',
    },
    include: {
      _count: {
        select: {
          subjects: true,
          allowedUsers: true // Include count of allowed users
        }
      },
      allowedUsers: { // Include allowed users minimal info for Admin UI
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  });
};

export const getCategoryById = async (id: string, user?: { id: string; role: string }) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      subjects: {
        orderBy: {
          order: 'asc'
        }
      },
      allowedUsers: true
    }
  });

  if (!category) return null;

  // Access Control
  if (user?.role === 'ADMIN') {
    return category;
  }

  // 1. Must be published
  if (!category.isPublished) {
    return null;
  }

  // 2. Must be public or user must be in allowedUsers
  if (category.isPublic) {
    return category;
  }

  if (user && category.allowedUsers.some(u => u.id === user.id)) {
    return category;
  }

  // If we reach here, the category exists and is published, but the user does not have access.
  // Instead of returning null (404), we throw an error to signal 403.
  throw new Error('ACCESS_DENIED');
};

export const updateCategory = async (id: string, data: { name?: string; order?: number; isPublished?: boolean; isPublic?: boolean; allowedUserIds?: string[] }) => {
  const { allowedUserIds, ...rest } = data;

  return prisma.category.update({
    where: { id },
    data: {
      ...rest,
      allowedUsers: allowedUserIds ? {
        set: allowedUserIds.map((id) => ({ id })) // Replace existing relations
      } : undefined
    },
    include: {
      allowedUsers: true
    }
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};
