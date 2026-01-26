import { z } from 'zod';

const testQuestionSchema = z.object({
  questionId: z.string().uuid('Each question ID must be a valid UUID'),
  order: z.number({ required_error: 'Order is required' }).int().positive('Order must be a positive integer'),
});

const testBodyBase = z.object({
  name: z.string({ required_error: 'Test name is required' }).min(3, 'Test name must be at least 3 characters long'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  durationMinutes: z.number().int().positive('Duration must be a positive integer').optional(),
  maxAttempts: z.number().int().min(0, 'Max attempts must be 0 or greater').default(0),
  learningObjectiveId: z.string().uuid('Learning Objective ID must be a valid UUID').optional(),
  questions: z.array(testQuestionSchema)
    .min(1, 'A test must have at least one question')
    .refine(items => new Set(items.map(i => i.order)).size === items.length, {
      message: 'Question order numbers must be unique',
    }),
});

export const createTestSchema = z.object({
  body: testBodyBase,
});

export const updateTestSchema = z.object({
  params: z.object({
    id: z.string().uuid('The ID must be a valid UUID'),
  }),
  // For update, we allow partial modifications.
  // Updating questions is a complex operation (add/remove/reorder), 
  // so we might handle it with separate endpoints later.
  // For now, we allow updating name/description and the entire questions array.
  body: testBodyBase.partial(),
});
