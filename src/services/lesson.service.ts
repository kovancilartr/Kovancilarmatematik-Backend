import { prisma } from '../config/database';

export const createLesson = async (data: { name: string; videoUrl: string; learningObjectiveId: string; order: number }) => {
  return prisma.lesson.create({
    data,
  });
};

export const getAllLessons = async () => {
  return prisma.lesson.findMany({
    orderBy: {
      order: 'asc', // Sort by order field
    },
    include: {
      learningObjective: { include: { subject: true } }, // Include LO and Subject
      materials: true, // Include related materials
    }
  });
};

export const getLessonsByLearningObjectiveId = async (learningObjectiveId: string) => {
  return prisma.lesson.findMany({
    where: { learningObjectiveId },
    orderBy: {
      order: 'asc', // Sort by order field
    },
    include: {
      learningObjective: true,
      materials: true, // Include related materials
    }
  });
};

export const getLessonById = async (id: string) => {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      learningObjective: { include: { subject: true } },
      materials: true, // Include related materials
    }
  });
};

export const updateLesson = async (id: string, data: { name?: string; videoUrl?: string; learningObjectiveId?: string; order?: number }) => {
  return prisma.lesson.update({
    where: { id },
    data,
  });
};

export const deleteLesson = async (id: string) => {
  return prisma.lesson.delete({
    where: { id },
  });
};
