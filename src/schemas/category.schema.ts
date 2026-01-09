import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters long'),
  order: z.number().int().positive('Order must be a positive integer'),
  isPublished: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  allowedUserIds: z.array(z.string()).optional(), // Only for input to link users
});

export const createCategorySchema = CategorySchema;

export const updateCategorySchema = CategorySchema.partial(); // Allows partial updates

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
