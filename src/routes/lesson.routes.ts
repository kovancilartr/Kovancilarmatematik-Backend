import { Router } from 'express';
import {
    createLessonHandler,
    getAllLessonsHandler,
    getLessonsBySubjectIdHandler,
    getLessonByIdHandler,
    updateLessonHandler,
    deleteLessonHandler
} from '../controllers/lesson.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createLessonSchema, updateLessonSchema } from '../schemas/lesson.schema';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', getAllLessonsHandler); // Get all lessons
router.get('/subject/:subjectId', getLessonsBySubjectIdHandler); // Get lessons by Subject ID
router.get('/:id', getLessonByIdHandler); // Get a single lesson by ID

// Admin-only routes
router.post(
    '/',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    validateRequest(createLessonSchema),
    createLessonHandler
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    validateRequest(updateLessonSchema),
    updateLessonHandler
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    deleteLessonHandler
);

export default router;
