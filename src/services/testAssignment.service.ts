import { prisma } from '../config/database';
import { Prisma, Role } from '@prisma/client';
import { createErrorResponse } from '../utils/response.utils';

export const createAssignments = async (testId: string, studentIds: string[], creatorId: string) => {
  // Verify that the creator has the right to assign (is ADMIN or TEACHER)
  const creator = await prisma.user.findUnique({ where: { id: creatorId } });
  if (!creator || (creator.role !== Role.ADMIN && creator.role !== Role.TEACHER)) { // DÜZELTİLDİ
    throw new Error('User does not have permission to assign tests.');
  }

  // Verify that all recipients are students
  const students = await prisma.user.findMany({
    where: {
      id: { in: studentIds },
      role: Role.STUDENT,
    },
  });
  if (students.length !== studentIds.length) {
    throw new Error('One or more provided IDs do not belong to valid students.');
  }

  const assignmentsData = studentIds.map(studentId => ({
    testId,
    studentId,
  }));

  // Create assignments, skipping any that already exist
  const result = await prisma.testAssignment.createMany({
    data: assignmentsData,
    skipDuplicates: true,
  });

  return result;
};

export const getAssignmentsForStudent = async (studentId: string) => {
    return prisma.testAssignment.findMany({
        where: { studentId },
        orderBy: { test: { name: 'asc' } },
        include: {
            test: {
                include: {
                    _count: {
                        select: { questions: true }
                    }
                }
            }
        }
    });
};

export const getAssignmentDetailsForStudent = async (assignmentId: string, studentId: string) => {
    const assignment = await prisma.testAssignment.findUnique({
        where: { id: assignmentId },
        include: {
            test: {
                include: {
                    questions: {
                        orderBy: { order: 'asc' },
                        include: {
                            // We only include the question part, not the answer
                            question: {
                                select: {
                                    id: true,
                                    imageUrl: true,
                                    options: true,
                                    difficulty: true
                                }
                            }
                        }
                    }
                }
            },
            studentAnswers: { // Include previous answers
                select: {
                    questionId: true,
                    selectedAnswer: true
                }
            }
        }
    });

    // Security Check: Ensure the assignment belongs to the requesting student
    if (!assignment || assignment.studentId !== studentId) {
        return null;
    }

    return assignment;
}

export const startTest = async (assignmentId: string, studentId: string) => {
    return prisma.testAssignment.update({
        where: {
            id: assignmentId,
            studentId: studentId, // Ensure ownership
            status: 'ASSIGNED' // Can only start if it hasn't been started
        },
        data: {
            status: 'IN_PROGRESS',
            startedAt: new Date(),
        }
    });
}

export const submitAndGradeTest = async (assignmentId: string, studentId: string) => {
    // This is a complex transaction
    return prisma.$transaction(async (tx) => {
        // 1. Verify the assignment
        const assignment = await tx.testAssignment.findFirst({
            where: { id: assignmentId, studentId, status: 'IN_PROGRESS' },
            include: { studentAnswers: true, test: { include: { questions: { include: { question: true } } } } }
        });

        if (!assignment) {
            throw new Error("Assignment not found, does not belong to the user, or is not in progress.");
        }

        // 2. Grade the answers
        let correctCount = 0;
        const gradingPromises = assignment.studentAnswers.map(async (studentAnswer) => {
            const questionInTest = assignment.test.questions.find(q => q.questionId === studentAnswer.questionId);
            if (questionInTest) {
                const isCorrect = questionInTest.question.correctAnswer === studentAnswer.selectedAnswer;
                if (isCorrect) {
                    correctCount++;
                }
                return tx.studentAnswer.update({
                    where: { id: studentAnswer.id },
                    data: { isCorrect }
                });
            }
        });
        await Promise.all(gradingPromises);

        // 3. Calculate final score
        const totalQuestions = assignment.test.questions.length;
        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

        // 4. Update the assignment with the final score and status
        const completedAssignment = await tx.testAssignment.update({
            where: { id: assignmentId },
            data: {
                status: 'COMPLETED',
                score: parseFloat(score.toFixed(2)),
                completedAt: new Date()
            }
        });
        return completedAssignment;
    });
}

export const saveStudentAnswer = async (assignmentId: string, studentId: string, questionId: string, selectedAnswer: string) => {
    // Verify assignment belongs to user and is in progress
    const assignment = await prisma.testAssignment.findFirst({
        where: { id: assignmentId, studentId, status: 'IN_PROGRESS' }
    });
    if (!assignment) {
        throw new Error('Cannot save answer. Assignment not valid or not in progress.');
    }

    // Use upsert with the composite unique key we added to the schema
    return prisma.studentAnswer.upsert({
        where: {
            testAssignmentId_questionId: {
                testAssignmentId: assignmentId,
                questionId: questionId,
            }
        },
        update: {
            selectedAnswer,
        },
        create: {
            testAssignmentId: assignmentId,
            questionId,
            selectedAnswer,
        }
    });
};
