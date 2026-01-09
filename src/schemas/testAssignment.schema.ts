import { z } from 'zod';

/**
 * Schema for assigning a test to one or more students.
 * Used by teachers/admins.
 */
export const createTestAssignmentSchema = z.object({
  body: z.object({
    testId: z.string({ required_error: 'Test ID is required' }).uuid('Test ID must be a valid UUID'),
    studentIds: z.array(z.string().uuid('Each student ID must be a valid UUID'))
                 .min(1, 'At least one student ID is required'),
  }),
});

/**
 * Schema for a student submitting an answer to a question within a test.
 * This would be used in a route like `POST /assignments/:assignmentId/answers`.
 */
export const submitAnswerSchema = z.object({
  params: z.object({
    assignmentId: z.string().uuid('Assignment ID must be a valid UUID'),
  }),
  body: z.object({
    questionId: z.string({ required_error: 'Question ID is required' }).uuid('Question ID must be a valid UUID'),
    selectedAnswer: z.string({ required_error: 'Selected answer is required' }).regex(/^[a-e]$/, 'Selected answer must be one of "a", "b", "c", "d", "e"'),
  }),
});
