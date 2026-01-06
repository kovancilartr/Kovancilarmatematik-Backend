import { z } from 'zod';

export const SubjectSchema = z.object({
  name: z.string().min(3, 'Subject name must be at least 3 characters long'),
  order: z.number().int().positive('Order must be a positive integer'),
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
});

export const createSubjectSchema = SubjectSchema;

export const updateSubjectSchema = SubjectSchema.partial(); // Allows partial updates

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
