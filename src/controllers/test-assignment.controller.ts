import { Response } from 'express';
import * as testAssignmentService from '../services/test-assignment.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const submitTestHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { testId, answers } = req.body;
        const studentId = req.user!.id;

        if (!testId || !answers) {
            return res.status(400).json(createErrorResponse('BAD_REQUEST', 'testId and answers are required'));
        }

        const result = await testAssignmentService.submitTest(testId, studentId, answers);

        return res.status(201).json(createSuccessResponse(result, 'Test submitted successfully'));
    } catch (error: any) {
        if (error.message === 'Test not found') {
            return res.status(404).json(createErrorResponse('NOT_FOUND', error.message));
        }
        return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};

export const getMyTestAssignmentsHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const studentId = req.user!.id;
        const assignments = await testAssignmentService.getStudentTestAssignments(studentId);

        return res.status(200).json(createSuccessResponse(assignments, 'Test assignments retrieved successfully'));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};

export const getTestAssignmentByIdHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const studentId = req.user!.id;

        const assignment = await testAssignmentService.getTestAssignmentById(id, studentId);

        if (!assignment) {
            return res.status(404).json(createErrorResponse('NOT_FOUND', 'Test assignment not found'));
        }

        return res.status(200).json(createSuccessResponse(assignment, 'Test assignment retrieved successfully'));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};

export const checkTestAttemptHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { testId } = req.params;
        const studentId = req.user!.id;

        const result = await testAssignmentService.checkTestAttemptLimit(testId, studentId);

        return res.status(200).json(createSuccessResponse(result, 'Attempt check completed'));
    } catch (error: any) {
        if (error.message === 'Test not found') {
            return res.status(404).json(createErrorResponse('NOT_FOUND', error.message));
        }
        return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};
