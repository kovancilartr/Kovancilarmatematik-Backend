import { prisma } from '../config/database';

export const createLesson = async (data: { name: string; videoUrl: string; subjectId: string }) => {
  return prisma.lesson.create({
    data,
  });
};

export const getAllLessons = async () => {
  return prisma.lesson.findMany({
    orderBy: {
      name: 'asc', // Default sort by name for now
    },
    include: {
        subject: true, // Include subject information
        materials: true, // Include related materials
    }
  });
};

export const getLessonsBySubjectId = async (subjectId: string) => {
    return prisma.lesson.findMany({
      where: { subjectId },
      orderBy: {
        name: 'asc', // Default sort by name for now
      },
      include: {
          subject: true, // Include subject information
          materials: true, // Include related materials
      }
    });
  };

export const getLessonById = async (id: string) => {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
        subject: true, // Include subject information
        materials: true, // Include related materials
    }
  });
};

export const updateLesson = async (id: string, data: { name?: string; videoUrl?: string; subjectId?: string }) => {
  return prisma.lesson.update({
    where: { id },
    data,
  });
};

export const deleteLesson = async (id:string) => {
  return prisma.lesson.delete({
    where: { id },
  });
};
