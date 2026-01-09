import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { hashPassword } from '../utils/password.utils';
import { Role } from '@prisma/client';

export class UserController {
    /**
     * Get all users with optional filtering
     */
    static async getAllUsers(req: Request, res: Response) {
        try {
            const { role, search } = req.query;

            const where: any = {};

            if (role && Object.values(Role).includes(role as Role)) {
                where.role = role;
            }

            if (search) {
                where.OR = [
                    { name: { contains: String(search), mode: 'insensitive' } },
                    { email: { contains: String(search), mode: 'insensitive' } },
                ];
            }

            const users = await prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    // Exclude password
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            res.status(200).json(createSuccessResponse(users, 'Users retrieved successfully'));
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json(createErrorResponse('SERVER_ERROR', 'Failed to retrieve users'));
        }
    }

    /**
     * Get user by ID
     */
    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            if (!user) {
                return res.status(404).json(createErrorResponse('NOT_FOUND', 'User not found'));
            }

            res.status(200).json(createSuccessResponse(user, 'User retrieved successfully'));
        } catch (error) {
            console.error('Get user by id error:', error);
            res.status(500).json(createErrorResponse('SERVER_ERROR', 'Failed to retrieve user'));
        }
    }

    /**
     * Create new user (Admin only)
     */
    static async createUser(req: Request, res: Response) {
        try {
            const { email, name, password, role } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                return res.status(409).json(createErrorResponse('CONFLICT', 'User with this email already exists'));
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    name,
                    password: hashedPassword,
                    role,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            res.status(201).json(createSuccessResponse(user, 'User created successfully'));
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json(createErrorResponse('SERVER_ERROR', 'Failed to create user'));
        }
    }

    /**
     * Update user
     */
    static async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { email, name, password, role } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { id },
            });

            if (!existingUser) {
                return res.status(404).json(createErrorResponse('NOT_FOUND', 'User not found'));
            }

            // Prepare update data
            const updateData: any = {};
            if (email) updateData.email = email.toLowerCase();
            if (name) updateData.name = name;
            if (role) updateData.role = role;
            if (password) {
                updateData.password = await hashPassword(password);
            }

            // Check email uniqueness if changing email
            if (email && email.toLowerCase() !== existingUser.email) {
                const emailCheck = await prisma.user.findUnique({
                    where: { email: email.toLowerCase() },
                });
                if (emailCheck) {
                    return res.status(409).json(createErrorResponse('CONFLICT', 'Email is already in use'));
                }
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            res.status(200).json(createSuccessResponse(updatedUser, 'User updated successfully'));
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json(createErrorResponse('SERVER_ERROR', 'Failed to update user'));
        }
    }

    /**
     * Delete user
     */
    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const authenticatedUserId = (req as any).user?.id; // Assuming user is attached by auth middleware

            if (id === authenticatedUserId) {
                return res.status(400).json(createErrorResponse('BAD_REQUEST', 'You cannot delete your own account'));
            }

            const existingUser = await prisma.user.findUnique({
                where: { id },
            });

            if (!existingUser) {
                return res.status(404).json(createErrorResponse('NOT_FOUND', 'User not found'));
            }

            await prisma.user.delete({
                where: { id },
            });

            res.status(200).json(createSuccessResponse(null, 'User deleted successfully'));
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json(createErrorResponse('SERVER_ERROR', 'Failed to delete user'));
        }
    }
}
