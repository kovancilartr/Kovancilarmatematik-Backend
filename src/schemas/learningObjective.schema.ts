import { z } from 'zod';

const learningObjectiveBodyBase = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters long'),
  order: z.number({ required_error: 'Order is required' }).int().positive('Order must be a positive integer'),
  subjectId: z.string({ required_error: 'Subject ID is required' }).uuid('Subject ID must be a valid UUID'),
});

export const createLearningObjectiveSchema = z.object({
  body: learningObjectiveBodyBase,
});

export const updateLearningObjectiveSchema = z.object({
  params: z.object({
    id: z.string().uuid('The ID must be a valid UUID'),
  }),
  body: learningObjectiveBodyBase.partial(), // All fields are optional
});
