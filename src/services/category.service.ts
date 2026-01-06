import { prisma } from '../config/database';

export const createCategory = async (data: { name: string; order: number }) => {
  return prisma.category.create({
    data,
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
        subjects: true // Also include related subjects
    }
  });
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
        subjects: {
            orderBy: {
                order: 'asc'
            }
        }
    }
  });
};

export const updateCategory = async (id: string, data: { name?: string; order?: number }) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id:string) => {
  return prisma.category.delete({
    where: { id },
  });
};
