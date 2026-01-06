import { Router } from 'express';
import {
    createSubjectHandler,
    getAllSubjectsHandler,
    getSubjectsByCategoryIdHandler,
    getSubjectByIdHandler,
    updateSubjectHandler,
    deleteSubjectHandler
} from '../controllers/subject.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createSubjectSchema, updateSubjectSchema } from '../schemas/subject.schema';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', getAllSubjectsHandler); // Get all subjects
router.get('/category/:categoryId', getSubjectsByCategoryIdHandler); // Get subjects by Category ID
router.get('/:id', getSubjectByIdHandler); // Get a single subject by ID

// Admin-only routes
router.post(
    '/',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    validateRequest(createSubjectSchema),
    createSubjectHandler
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    validateRequest(updateSubjectSchema),
    updateSubjectHandler
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    deleteSubjectHandler
);

export default router;
