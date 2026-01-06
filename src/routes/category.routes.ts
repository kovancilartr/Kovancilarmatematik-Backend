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
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', getAllCategoriesHandler);
router.get('/:id', getCategoryByIdHandler);

// Admin-only routes
router.post(
    '/', 
    authenticateToken, 
    authorizeRole(Role.ADMIN), 
    validateRequest(createCategorySchema), 
    createCategoryHandler
);

router.put(
    '/:id', 
    authenticateToken, 
    authorizeRole(Role.ADMIN), 
    validateRequest(updateCategorySchema), 
    updateCategoryHandler
);

router.delete(
    '/:id', 
    authenticateToken, 
    authorizeRole(Role.ADMIN), 
    deleteCategoryHandler
);

export default router;
