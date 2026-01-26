import { Response } from 'express';
import * as testService from '../services/test.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { createTestSchema, updateTestSchema } from '../schemas/test.schema';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

// Infer TS types from Zod schemas
type CreateTestInput = z.infer<typeof createTestSchema>;
type UpdateTestInput = z.infer<typeof updateTestSchema>;

export const createTestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, durationMinutes, maxAttempts, learningObjectiveId, questions } = req.body as CreateTestInput;
    const createdById = req.user!.id; // Non-null assertion because authenticateToken middleware ensures user exists

    const testData = { name, description, durationMinutes, maxAttempts, learningObjectiveId, questions, createdById };
    const test = await testService.createTest(testData);

    return res.status(201).json(createSuccessResponse(test, 'Test created successfully'));
  } catch (error: any) {
    // P2003: Foreign key constraint failed on the field: `questionId`
    if (error.code === 'P2003') {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'One or more question IDs provided do not exist.'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getAllTestsHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tests = await testService.getAllTests();
    return res.status(200).json(createSuccessResponse(tests, 'Tests retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getTestByIdHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const test = await testService.getTestById(id);
    if (!test) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Test not found'));
    }
    return res.status(200).json(createSuccessResponse(test, 'Test retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const updateTestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const testData = req.body as UpdateTestInput;

    // Update test including questions if provided
    const updatedTest = await testService.updateTestDetails(id, {
      name: testData.name,
      description: testData.description,
      durationMinutes: testData.durationMinutes,
      maxAttempts: testData.maxAttempts,
      learningObjectiveId: testData.learningObjectiveId,
      questions: testData.questions, // Pass questions to service
    });

    return res.status(200).json(createSuccessResponse(updatedTest, 'Test updated successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Test not found.'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const deleteTestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await testService.deleteTest(id);
    return res.status(200).json(createSuccessResponse(null, 'Test deleted successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Test not found'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};
