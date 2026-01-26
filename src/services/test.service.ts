import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

interface QuestionData {
  questionId: string;
  order: number;
}

interface TestData {
  name: string;
  description?: string;
  durationMinutes?: number;
  maxAttempts?: number;
  createdById: string;
  learningObjectiveId?: string;
  questions: QuestionData[];
}

export const createTest = async (data: TestData) => {
  const { name, description, durationMinutes, maxAttempts, createdById, questions } = data;

  return prisma.$transaction(async (tx) => {
    const newTest = await tx.test.create({
      data: {
        name,
        description,
        durationMinutes,
        maxAttempts: maxAttempts ?? 0,
        learningObjectiveId: data.learningObjectiveId,
        createdById,
      },
    });

    // 2. Prepare the TestQuestion records
    const testQuestionsData = questions.map((q) => ({
      testId: newTest.id,
      questionId: q.questionId,
      order: q.order,
    }));

    // 3. Create the links in the join table
    await tx.testQuestion.createMany({
      data: testQuestionsData,
    });

    return newTest;
  });
};

export const getAllTests = async () => {
  return prisma.test.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
        }
      },
      questions: {
        include: {
          question: true, // Include full question details
        },
        orderBy: {
          order: 'asc', // Sort questions by their order
        }
      },
      _count: {
        select: { questions: true } // Get the number of questions in each test
      }
    }
  });
};

export const getTestById = async (id: string) => {
  return prisma.test.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
        }
      },
      questions: { // Get the related TestQuestion records
        orderBy: {
          order: 'asc',
        },
        include: {
          question: true, // And for each, include the actual Question details
        },
      },
    },
  });
};

export const deleteTest = async (id: string) => {
  // The relation is cascading, so deleting the test will also delete TestQuestion entries
  return prisma.test.delete({
    where: { id },
  });
};

// Update test details and questions
export const updateTestDetails = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    durationMinutes?: number;
    maxAttempts?: number;
    learningObjectiveId?: string;
    questions?: { questionId: string; order: number }[]
  }
) => {
  // If questions are provided, delete old ones and create new ones in a transaction
  if (data.questions) {
    return prisma.$transaction(async (tx) => {
      // Delete all existing test questions
      await tx.testQuestion.deleteMany({
        where: { testId: id },
      });

      // Create new test questions
      if (data.questions && data.questions.length > 0) {
        await tx.testQuestion.createMany({
          data: data.questions.map((q) => ({
            testId: id,
            questionId: q.questionId,
            order: q.order,
          })),
        });
      }

      // Update test basic info
      return tx.test.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          durationMinutes: data.durationMinutes,
          maxAttempts: data.maxAttempts,
          learningObjectiveId: data.learningObjectiveId,
        },
      });
    });
  }

  // If no questions provided, just update basic info
  return prisma.test.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      durationMinutes: data.durationMinutes,
      maxAttempts: data.maxAttempts,
      learningObjectiveId: data.learningObjectiveId,
    },
  });
};
