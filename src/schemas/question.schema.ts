import { z } from 'zod';

const questionBodyBase = z.object({
  imageUrl: z.string({ required_error: 'Image URL is required' }).url('Image URL must be a valid URL'),
  // Options: a record of string keys to string values, must have exactly 5 entries (a, b, c, d, e)
  options: z.record(z.string().regex(/^[a-e]$/, 'Option keys must be a, b, c, d, or e'), z.string().min(1, 'Option text cannot be empty'))
    .refine(options => Object.keys(options).length === 5 && ['a', 'b', 'c', 'd', 'e'].every(key => key in options), 'Options must contain exactly 5 key-value pairs (a, b, c, d, e).'),
  correctAnswer: z.string({ required_error: 'Correct answer is required' }).regex(/^[a-e]$/, 'Correct answer must be one of "a", "b", "c", "d", "e"'),
  difficulty: z.number({ required_error: 'Difficulty is required' }).int().min(1, 'Difficulty must be at least 1').max(10, 'Difficulty cannot exceed 10'),
  learningObjectiveId: z.string({ required_error: 'Learning Objective ID is required' }).uuid('Learning Objective ID must be a valid UUID'),
});

export const createQuestionSchema = z.object({
  body: questionBodyBase,
});

export const updateQuestionSchema = z.object({
  params: z.object({
    id: z.string().uuid('The ID must be a valid UUID'),
  }),
  body: questionBodyBase.partial(), // All fields are optional for update
});
