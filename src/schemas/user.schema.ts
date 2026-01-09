import { z } from 'zod';
import { Role } from '@prisma/client';

/**
 * Common validation schemas (reused from auth.schema logic for consistency)
 */
const emailSchema = z
    .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    })
    .min(1, 'Email cannot be empty')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim();

const passwordSchema = z
    .string({
        invalid_type_error: 'Password must be a string'
    })
    .min(6, 'Password must be at least 6 characters long') // Less strict for admin created users initially? Or keep strong? Keeping 6 for now as basic security.
    .max(128, 'Password must be less than 128 characters');

const nameSchema = z
    .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
    })
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be less than 100 characters')
    .trim();

/**
 * Create User Schema
 */
export const createUserSchema = z.object({
    body: z.object({
        email: emailSchema,
        name: nameSchema,
        password: passwordSchema,
        role: z.nativeEnum(Role),
    }),
});

/**
 * Update User Schema
 * Password is optional. If provided, it will be updated.
 */
export const updateUserSchema = z.object({
    body: z.object({
        email: emailSchema.optional(),
        name: nameSchema.optional(),
        password: passwordSchema.optional(), // Optional for updates
        role: z.nativeEnum(Role).optional(),
    }),
});
