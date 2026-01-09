import { Router } from 'express';
import {
    createCategoryHandler,
    getAllCategoriesHandler,
    getCategoryByIdHandler,
    updateCategoryHandler,
    deleteCategoryHandler
} from '../controllers/category.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { authenticateToken, authorizeRole, authenticateTokenOptional } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes (with optional auth for Role based filtering)
router.get('/', authenticateTokenOptional, getAllCategoriesHandler);
router.get('/:id', authenticateTokenOptional, getCategoryByIdHandler);

// Admin-only routes
router.post(
    '/',
    authenticateToken,
    authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
    validateRequest(createCategorySchema),
    createCategoryHandler
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
    validateRequest(updateCategorySchema),
    updateCategoryHandler
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
    deleteCategoryHandler
);

export default router;
