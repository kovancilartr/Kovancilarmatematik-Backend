import { Request, Response } from 'express';
import * as learningObjectiveService from '../services/learningObjective.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { createLearningObjectiveSchema, updateLearningObjectiveSchema } from '../schemas/learningObjective.schema';
import { z } from 'zod';

// Infer TS types from Zod schemas
type CreateLearningObjectiveInput = z.infer<typeof createLearningObjectiveSchema>;
type UpdateLearningObjectiveInput = z.infer<typeof updateLearningObjectiveSchema>;

export const createLearningObjectiveHandler = async (req: Request<{}, {}, CreateLearningObjectiveInput>, res: Response) => {
  try {
    const learningObjective = await learningObjectiveService.createLearningObjective(req.body);
    return res.status(201).json(createSuccessResponse(learningObjective, 'Learning objective created successfully'));
  } catch (error: any) {
    // P2025: Foreign key constraint failed (e.g., Subject not found)
    if (error.code === 'P2025') {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'The specified subject does not exist.'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getAllLearningObjectivesHandler = async (req: Request, res: Response) => {
  try {
    const learningObjectives = await learningObjectiveService.getAllLearningObjectives();
    return res.status(200).json(createSuccessResponse(learningObjectives, 'Learning objectives retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getLearningObjectivesBySubjectIdHandler = async (req: Request<{ subjectId: string }>, res: Response) => {
  try {
    const { subjectId } = req.params;
    const learningObjectives = await learningObjectiveService.getLearningObjectivesBySubjectId(subjectId);
    return res.status(200).json(createSuccessResponse(learningObjectives, 'Learning objectives for the subject retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getLearningObjectiveByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const learningObjective = await learningObjectiveService.getLearningObjectiveById(id);
    if (!learningObjective) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Learning objective not found'));
    }
    return res.status(200).json(createSuccessResponse(learningObjective, 'Learning objective retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const updateLearningObjectiveHandler = async (req: Request<{ id: string }, {}, UpdateLearningObjectiveInput>, res: Response) => {
  try {
    const { id } = req.params;
    const updatedLearningObjective = await learningObjectiveService.updateLearningObjective(id, req.body);
    return res.status(200).json(createSuccessResponse(updatedLearningObjective, 'Learning objective updated successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'The learning objective or associated subject not found.'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const deleteLearningObjectiveHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    await learningObjectiveService.deleteLearningObjective(id);
    return res.status(200).json(createSuccessResponse(null, 'Learning objective deleted successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Learning objective not found'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};
