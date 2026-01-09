import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

interface QuestionCreateData {
  imageUrl: string;
  options: Prisma.JsonObject;
  correctAnswer: string;
  difficulty: number;
  learningObjectiveId: string;
}

interface QuestionUpdateData {
  imageUrl?: string;
  options?: Prisma.JsonObject;
  correctAnswer?: string;
  difficulty?: number;
  learningObjectiveId?: string;
}

export const createQuestion = async (data: QuestionCreateData) => {
  const { imageUrl, options, correctAnswer, difficulty, learningObjectiveId } = data;
  return prisma.question.create({
    data: {
      imageUrl,
      options,
      correctAnswer,
      difficulty,
      learningObjective: {
        connect: { id: learningObjectiveId }
      }
    },
  });
};

export const getAllQuestions = async () => {
  return prisma.question.findMany({
    orderBy: {
      difficulty: 'asc',
    },
    include: {
      learningObjective: {
        include: {
          subject: {
            include: {
              category: true, // Include category as well
            },
          },
        },
      },
    },
  });
};

export const getQuestionsByLearningObjectiveId = async (learningObjectiveId: string) => {
  return prisma.question.findMany({
    where: { learningObjectiveId },
    orderBy: {
      difficulty: 'asc',
    },
    include: {
      learningObjective: {
        include: {
          subject: true,
        },
      },
    },
  });
};

export const getQuestionById = async (id: string) => {
  return prisma.question.findUnique({
    where: { id },
    include: {
      learningObjective: {
        include: {
          subject: true,
        },
      },
    },
  });
};

export const updateQuestion = async (id: string, data: QuestionUpdateData) => {
  const { imageUrl, options, correctAnswer, difficulty, learningObjectiveId } = data;
  const prismaData: Prisma.QuestionUpdateInput = {};

  if (imageUrl) prismaData.imageUrl = imageUrl;
  if (options) prismaData.options = options;
  if (correctAnswer) prismaData.correctAnswer = correctAnswer;
  if (difficulty) prismaData.difficulty = difficulty;
  if (learningObjectiveId) {
    prismaData.learningObjective = {
      connect: { id: learningObjectiveId }
    }
  }

  return prisma.question.update({
    where: { id },
    data: prismaData,
  });
};

export const deleteQuestion = async (id: string) => {
  return prisma.question.delete({
    where: { id },
  });
};
