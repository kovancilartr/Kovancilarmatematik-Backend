import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

interface LearningObjectiveCreateData {
  name: string;
  order: number;
  subjectId: string;
}

interface LearningObjectiveUpdateData {
    name?: string;
    order?: number;
    subjectId?: string;
}

export const createLearningObjective = async (data: LearningObjectiveCreateData) => {
  const { name, order, subjectId } = data;
  return prisma.learningObjective.create({
    data: {
      name,
      order,
      subject: {
        connect: { id: subjectId },
      },
    },
  });
};

export const getAllLearningObjectives = async () => {
  return prisma.learningObjective.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      subject: true, // Include the parent subject
    },
  });
};

export const getLearningObjectivesBySubjectId = async (subjectId: string) => {
  return prisma.learningObjective.findMany({
    where: { subjectId },
    orderBy: {
      order: 'asc',
    },
    include: {
      subject: true, // Include the parent subject
    },
  });
};

export const getLearningObjectiveById = async (id: string) => {
  return prisma.learningObjective.findUnique({
    where: { id },
    include: {
      subject: true, // Include the parent subject
      questions: {   // Include related questions
        orderBy: {
          difficulty: 'asc', // Order questions by difficulty
        },
      },
    },
  });
};

export const updateLearningObjective = async (id: string, data: LearningObjectiveUpdateData) => {
    const { name, order, subjectId } = data;
    const prismaData: Prisma.LearningObjectiveUpdateInput = {};

    if (name) prismaData.name = name;
    if (order) prismaData.order = order;
    if (subjectId) {
        prismaData.subject = {
            connect: { id: subjectId }
        }
    }

    return prisma.learningObjective.update({
        where: { id },
        data: prismaData,
    });
};

export const deleteLearningObjective = async (id: string) => {
  return prisma.learningObjective.delete({
    where: { id },
  });
};
