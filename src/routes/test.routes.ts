import { Router } from 'express';
import {
  createTestHandler,
  getAllTestsHandler,
  getTestByIdHandler,
  updateTestHandler,
  deleteTestHandler,
} from '../controllers/test.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createTestSchema, updateTestSchema } from '../schemas/test.schema';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All test routes require authentication
router.use(authenticateToken);

// Routes for ADMIN and TEACHER
router.post(
  '/',
  authorizeRole([Role.ADMIN, Role.TEACHER]),
  validateRequest(createTestSchema),
  createTestHandler
);

router.get(
  '/',
  authorizeRole([Role.ADMIN, Role.TEACHER]),
  getAllTestsHandler
);

router.put(
  '/:id',
  authorizeRole([Role.ADMIN, Role.TEACHER]),
  validateRequest(updateTestSchema),
  updateTestHandler
);

router.delete(
  '/:id',
  authorizeRole([Role.ADMIN, Role.TEACHER]),
  deleteTestHandler
);

// A single test can be fetched by any authenticated user for now
// (e.g., a student who is assigned the test would need to fetch its details)
router.get('/:id', getTestByIdHandler);

export default router;
