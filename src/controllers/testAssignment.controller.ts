import { Response } from 'express';
import * as service from '../services/testAssignment.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { createTestAssignmentSchema, submitAnswerSchema } from '../schemas/testAssignment.schema';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

type CreateTestAssignmentInput = z.infer<typeof createTestAssignmentSchema>;
type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

// FOR TEACHERS/ADMINS
export const createAssignmentsHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { testId, studentIds } = req.body as CreateTestAssignmentInput;
        const creatorId = req.user!.id;
        const result = await service.createAssignments(testId, studentIds, creatorId);
        return res.status(201).json(createSuccessResponse(result, `${result.count} assignment(s) created successfully.`));
    } catch (error: any) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', error.message));
    }
};

// FOR STUDENTS
export const getMyAssignmentsHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const studentId = req.user!.id;
        const assignments = await service.getAssignmentsForStudent(studentId);
        return res.status(200).json(createSuccessResponse(assignments, 'Assignments retrieved successfully.'));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};

export const getMyAssignmentDetailsHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const studentId = req.user!.id;
        const { assignmentId } = req.params;
        const assignment = await service.getAssignmentDetailsForStudent(assignmentId, studentId);
        if (!assignment) {
            return res.status(404).json(createErrorResponse('NOT_FOUND', 'Assignment not found or does not belong to you.'));
        }
        return res.status(200).json(createSuccessResponse(assignment, 'Assignment details retrieved successfully.'));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};

export const startMyTestHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const studentId = req.user!.id;
        const { assignmentId } = req.params;
        await service.startTest(assignmentId, studentId);
        return res.status(200).json(createSuccessResponse(null, 'Test started successfully.'));
    } catch (error: any) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Could not start test. It may have already been started or does not exist.'));
    }
};

export const saveMyAnswerHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const studentId = req.user!.id;
        const { assignmentId } = req.params;
        const { questionId, selectedAnswer } = req.body as SubmitAnswerInput;
        const savedAnswer = await service.saveStudentAnswer(assignmentId, studentId, questionId, selectedAnswer);
        return res.status(200).json(createSuccessResponse(savedAnswer, 'Answer saved.'));
    } catch (error: any) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', error.message));
    }
};

export const submitMyTestHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const studentId = req.user!.id;
        const { assignmentId } = req.params;
        const result = await service.submitAndGradeTest(assignmentId, studentId);
        return res.status(200).json(createSuccessResponse(result, 'Test submitted and graded successfully.'));
    } catch (error: any) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', error.message));
    }
};
