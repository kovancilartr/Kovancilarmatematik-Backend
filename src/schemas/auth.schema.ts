import { z } from 'zod';
import { Role } from '@prisma/client';

/**
 * Email validation schema
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

/**
 * Password validation schema for login
 */
const loginPasswordSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string'
  })
  .min(1, 'Password cannot be empty')
  .max(128, 'Password must be less than 128 characters');

/**
 * Strong password validation schema for registration
 */
const strongPasswordSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string'
  })
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Name validation schema
 */
const nameSchema = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string'
  })
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name must be less than 100 characters')
  .trim();

/**
 * Refresh token validation schema
 */
const refreshTokenSchema = z
  .string({
    required_error: 'Refresh token is required',
    invalid_type_error: 'Refresh token must be a string'
  })
  .min(1, 'Refresh token cannot be empty');

/**
 * Login request schema
 */
/**
 * Login request schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

/**
 * Register request schema (now used for creating users by admin)
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
  name: nameSchema,
  role: z.nativeEnum(Role),
});

/**
 * Refresh token request schema
 */
export const refreshTokenRequestSchema = z.object({
  refreshToken: refreshTokenSchema,
});

/**
 * Logout request schema
 */
export const logoutSchema = z.object({
  refreshToken: refreshTokenSchema,
});