import { prisma } from '../config/database';

export const createMaterial = async (data: { name: string; url: string; lessonId: string; order: number }) => {
  return prisma.material.create({
    data,
  });
};

export const getAllMaterials = async () => {
  return prisma.material.findMany({
    orderBy: {
      order: 'asc', // Sort by order field
    },
    include: {
      lesson: true, // Include lesson information
    }
  });
};

export const getMaterialsByLessonId = async (lessonId: string) => {
  return prisma.material.findMany({
    where: { lessonId },
    orderBy: {
      order: 'asc', // Sort by order field
    },
    include: {
      lesson: true, // Include lesson information
    }
  });
};

export const getMaterialById = async (id: string) => {
  return prisma.material.findUnique({
    where: { id },
    include: {
      lesson: true, // Include lesson information
    }
  });
};

export const updateMaterial = async (id: string, data: { name?: string; url?: string; lessonId?: string; order?: number }) => {
  return prisma.material.update({
    where: { id },
    data,
  });
};

export const deleteMaterial = async (id: string) => {
  return prisma.material.delete({
    where: { id },
  });
};
