import { Router } from 'express';
import {
  createLearningObjectiveHandler,
  getAllLearningObjectivesHandler,
  getLearningObjectivesBySubjectIdHandler,
  getLearningObjectiveByIdHandler,
  updateLearningObjectiveHandler,
  deleteLearningObjectiveHandler,
} from '../controllers/learningObjective.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createLearningObjectiveSchema, updateLearningObjectiveSchema } from '../schemas/learningObjective.schema';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', getAllLearningObjectivesHandler);
router.get('/subject/:subjectId', getLearningObjectivesBySubjectIdHandler);
router.get('/:id', getLearningObjectiveByIdHandler);

// Admin-only routes
router.post(
  '/',
  authenticateToken,
  authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
  validateRequest(createLearningObjectiveSchema),
  createLearningObjectiveHandler
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
  validateRequest(updateLearningObjectiveSchema),
  updateLearningObjectiveHandler
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
  deleteLearningObjectiveHandler
);

export default router;

