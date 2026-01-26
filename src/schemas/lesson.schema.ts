import { z } from 'zod';

export const LessonSchema = z.object({
  name: z.string().min(3, 'Lesson name must be at least 3 characters long'),
  videoUrl: z.string().url('Video URL must be a valid URL'),
  learningObjectiveId: z.string().uuid('Learning Objective ID must be a valid UUID'),
  order: z.number().int().min(0, 'Order must be a non-negative integer'),
});

export const createLessonSchema = LessonSchema;

export const updateLessonSchema = LessonSchema.partial(); // Allows partial updates

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
