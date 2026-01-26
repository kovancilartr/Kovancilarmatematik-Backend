import { prisma } from '../config/database';

export const createSubject = async (data: { name: string; order: number; categoryId: string }) => {
  return prisma.subject.create({
    data,
  });
};

export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      category: true, // Kategori bilgisi
      learningObjectives: {
        orderBy: {
          order: 'asc',
        },
        include: {
          questions: {
            orderBy: {
              // Soruları burada bir alana göre sıralayabilirsiniz, örn: oluşturulma tarihi
              id: 'asc',
            },
          },
        },
      },
    },
  });
};

export const getSubjectsByCategoryId = async (categoryId: string) => {
  return prisma.subject.findMany({
    where: { categoryId },
    orderBy: {
      order: 'asc',
    },
    include: {
      category: true, // Include category information
      learningObjectives: {
        orderBy: {
          order: 'asc',
        },
        include: {
          lessons: true, // Include lessons associated with the learning objective
          tests: true, // Include tests associated with the learning objective
        }
      }
    }
  });
};

export const getSubjectById = async (id: string) => {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      category: true, // Include category information
      learningObjectives: {
        include: {
          lessons: true
        }
      }
    }
  });
};

export const updateSubject = async (id: string, data: { name?: string; order?: number; categoryId?: string }) => {
  return prisma.subject.update({
    where: { id },
    data,
  });
};

export const deleteSubject = async (id: string) => {
  return prisma.subject.delete({
    where: { id },
  });
};
