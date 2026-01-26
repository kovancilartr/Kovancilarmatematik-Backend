import { z } from 'zod';

export const MaterialSchema = z.object({
  name: z.string().min(3, 'Material name must be at least 3 characters long'),
  url: z.string().url('URL must be a valid URL'),
  lessonId: z.string().uuid('Lesson ID must be a valid UUID'),
  order: z.number().int().min(0, 'Order must be a non-negative integer'),
});

export const createMaterialSchema = MaterialSchema;

export const updateMaterialSchema = MaterialSchema.partial(); // Allows partial updates

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
