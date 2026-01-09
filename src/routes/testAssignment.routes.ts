import { Router } from 'express';
import {
  createAssignmentsHandler,
  getMyAssignmentsHandler,
  getMyAssignmentDetailsHandler,
  startMyTestHandler,
  saveMyAnswerHandler,
  submitMyTestHandler,
} from '../controllers/testAssignment.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createTestAssignmentSchema, submitAnswerSchema } from '../schemas/testAssignment.schema';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All assignment routes require authentication
router.use(authenticateToken);

// == Teacher / Admin Routes ==
router.post(
  '/',
  authorizeRole([Role.ADMIN, Role.TEACHER]),
  validateRequest(createTestAssignmentSchema),
  createAssignmentsHandler
);


// == Student Routes ==
router.get(
  '/my',
  authorizeRole([Role.STUDENT]),
  getMyAssignmentsHandler
);

router.get(
  '/my/:assignmentId',
  authorizeRole([Role.STUDENT]),
  getMyAssignmentDetailsHandler
);

router.post(
  '/my/:assignmentId/start',
  authorizeRole([Role.STUDENT]),
  startMyTestHandler
);

router.post(
  '/my/:assignmentId/answers',
  authorizeRole([Role.STUDENT]),
  validateRequest(submitAnswerSchema),
  saveMyAnswerHandler
);

router.post(
  '/my/:assignmentId/submit',
  authorizeRole([Role.STUDENT]),
  submitMyTestHandler
);

export default router;
