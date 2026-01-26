import { prisma } from '../config/database';

interface AnswerData {
    questionId: string;
    selectedAnswer: string;
}

// Deneme limitini kontrol et
export const checkTestAttemptLimit = async (testId: string, studentId: string) => {
    const test = await prisma.test.findUnique({
        where: { id: testId },
        select: { maxAttempts: true },
    });

    if (!test) {
        throw new Error('Test not found');
    }

    // 0 = sınırsız
    const isUnlimited = test.maxAttempts === 0;

    // Kullanıcının bu teste kaç kez katıldığını (ve geçmiş denemelerini) getir
    const previousAttempts = await prisma.testAssignment.findMany({
        where: {
            testId,
            studentId,
            status: 'COMPLETED',
        },
        orderBy: {
            completedAt: 'desc',
        },
        include: {
            studentAnswers: {
                select: { isCorrect: true }
            }
        }
    });

    const attemptCount = previousAttempts.length;
    const allowed = isUnlimited || attemptCount < test.maxAttempts;
    const remaining = isUnlimited ? null : test.maxAttempts - attemptCount;

    const history = previousAttempts.map(attempt => ({
        id: attempt.id,
        score: attempt.score,
        completedAt: attempt.completedAt,
        correctCount: attempt.studentAnswers.filter(a => a.isCorrect === true).length,
        incorrectCount: attempt.studentAnswers.filter(a => a.isCorrect === false).length,
        // Empty count is harder to calc without knowing total questions at that time, 
        // but for history summary this is usually enough.
    }));

    return {
        allowed,
        remaining,
        total: test.maxAttempts,
        history,
    };
};

export const submitTest = async (
    testId: string,
    studentId: string,
    answers: Record<string, string> // questionId -> selectedAnswer
) => {
    // Deneme limitini kontrol et
    const attemptCheck = await checkTestAttemptLimit(testId, studentId);
    if (!attemptCheck.allowed) {
        throw new Error(`Test deneme limitine ulaştınız. (${attemptCheck.total} deneme)`);
    }

    return prisma.$transaction(async (tx) => {
        // 1. Fetch test with questions
        const test = await tx.test.findUnique({
            where: { id: testId },
            include: {
                questions: {
                    include: {
                        question: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        if (!test) {
            throw new Error('Test not found');
        }

        // 2. Calculate results
        let correctCount = 0;
        let incorrectCount = 0;
        let emptyCount = 0;
        const studentAnswersData: AnswerData[] = [];

        test.questions.forEach((tq) => {
            const question = tq.question;
            if (!question) return;

            const userAnswer = answers[question.id];

            if (!userAnswer) {
                emptyCount++;
                // Don't create StudentAnswer record for empty answers
            } else {
                const isCorrect = userAnswer === question.correctAnswer;
                if (isCorrect) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }

                studentAnswersData.push({
                    questionId: question.id,
                    selectedAnswer: userAnswer,
                });
            }
        });

        // 3. Calculate score
        const totalQuestions = test.questions.length;
        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

        // 4. Create TestAssignment
        const assignment = await tx.testAssignment.create({
            data: {
                testId,
                studentId,
                status: 'COMPLETED',
                score,
                startedAt: new Date(),
                completedAt: new Date(),
            },
        });

        // 5. Create StudentAnswer records
        if (studentAnswersData.length > 0) {
            await tx.studentAnswer.createMany({
                data: studentAnswersData.map((ans) => ({
                    testAssignmentId: assignment.id,
                    questionId: ans.questionId,
                    selectedAnswer: ans.selectedAnswer,
                    isCorrect: test.questions.find(
                        (tq) => tq.question?.id === ans.questionId
                    )?.question?.correctAnswer === ans.selectedAnswer,
                })),
            });
        }

        // 6. Fetch complete assignment with answers
        const completeAssignment = await tx.testAssignment.findUnique({
            where: { id: assignment.id },
            include: {
                studentAnswers: true,
                test: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return {
            ...completeAssignment,
            correctCount,
            incorrectCount,
            emptyCount,
        };
    });
};

export const getStudentTestAssignments = async (studentId: string) => {
    return prisma.testAssignment.findMany({
        where: { studentId },
        include: {
            test: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
            _count: {
                select: {
                    studentAnswers: true,
                },
            },
        },
        orderBy: {
            completedAt: 'desc',
        },
    });
};

export const getTestAssignmentById = async (id: string, studentId: string) => {
    return prisma.testAssignment.findFirst({
        where: {
            id,
            studentId, // Ensure student can only access their own assignments
        },
        include: {
            test: {
                include: {
                    questions: {
                        include: {
                            question: true,
                        },
                        orderBy: {
                            order: 'asc',
                        },
                    },
                },
            },
            studentAnswers: true,
        },
    });
};
