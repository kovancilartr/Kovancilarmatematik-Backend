import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { validateRequest as validate } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { Role } from '@prisma/client';

const router = Router();

// Protect all routes with authentication and Admin role
router.use(authenticateToken);
router.use(authorizeRole([Role.ADMIN]));

// Routes
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', validate(createUserSchema), UserController.createUser);
router.put('/:id', validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
