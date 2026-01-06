import { Router } from 'express';
import {
    createMaterialHandler,
    getAllMaterialsHandler,
    getMaterialsByLessonIdHandler,
    getMaterialByIdHandler,
    updateMaterialHandler,
    deleteMaterialHandler
} from '../controllers/material.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createMaterialSchema, updateMaterialSchema } from '../schemas/material.schema';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', getAllMaterialsHandler); // Get all materials
router.get('/lesson/:lessonId', getMaterialsByLessonIdHandler); // Get materials by Lesson ID
router.get('/:id', getMaterialByIdHandler); // Get a single material by ID

// Admin-only routes
router.post(
    '/',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    validateRequest(createMaterialSchema),
    createMaterialHandler
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    validateRequest(updateMaterialSchema),
    updateMaterialHandler
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRole(Role.ADMIN),
    deleteMaterialHandler
);

export default router;
