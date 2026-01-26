import { Router } from 'express';
import * as testAssignmentController from '../controllers/test-assignment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Submit a test (create test assignment with answers)
router.post('/', testAssignmentController.submitTestHandler);

// Get all test assignments for current user
router.get('/my-tests', testAssignmentController.getMyTestAssignmentsHandler);

// Check attempt limit for a test
router.get('/check-attempt/:testId', testAssignmentController.checkTestAttemptHandler);

// Get specific test assignment by ID
router.get('/:id', testAssignmentController.getTestAssignmentByIdHandler);

export default router;
