import { Router } from 'express';
import {
  createQuestionHandler,
  getAllQuestionsHandler,
  getQuestionsByLearningObjectiveIdHandler,
  getQuestionByIdHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
} from '../controllers/question.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createQuestionSchema, updateQuestionSchema } from '../schemas/question.schema';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes (for students to view questions in tests, though usually accessed via test)
router.get('/', getAllQuestionsHandler);
router.get('/learning-objective/:learningObjectiveId', getQuestionsByLearningObjectiveIdHandler);
router.get('/:id', getQuestionByIdHandler);

// Admin-only routes
router.post(
  '/',
  authenticateToken,
  authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
  validateRequest(createQuestionSchema),
  createQuestionHandler
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
  validateRequest(updateQuestionSchema),
  updateQuestionHandler
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([Role.ADMIN]), // DEĞİŞTİRİLDİ
  deleteQuestionHandler
);

export default router;
