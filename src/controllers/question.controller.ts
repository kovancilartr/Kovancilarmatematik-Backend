import { Request, Response } from 'express';
import * as questionService from '../services/question.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { createQuestionSchema, updateQuestionSchema } from '../schemas/question.schema';
import { z } from 'zod';

// Infer TS types from Zod schemas
type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const createQuestionHandler = async (req: Request<{}, {}, CreateQuestionInput>, res: Response) => {
  try {
    const question = await questionService.createQuestion(req.body);
    return res.status(201).json(createSuccessResponse(question, 'Question created successfully'));
  } catch (error: any) {
    // P2025: Foreign key constraint failed (e.g., LearningObjective not found)
    if (error.code === 'P2025') {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'The specified learning objective does not exist.'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getAllQuestionsHandler = async (req: Request, res: Response) => {
  try {
    const questions = await questionService.getAllQuestions();
    return res.status(200).json(createSuccessResponse(questions, 'Questions retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getQuestionsByLearningObjectiveIdHandler = async (req: Request<{ learningObjectiveId: string }>, res: Response) => {
  try {
    const { learningObjectiveId } = req.params;
    const questions = await questionService.getQuestionsByLearningObjectiveId(learningObjectiveId);
    return res.status(200).json(createSuccessResponse(questions, 'Questions for the learning objective retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getQuestionByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const question = await questionService.getQuestionById(id);
    if (!question) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Question not found'));
    }
    return res.status(200).json(createSuccessResponse(question, 'Question retrieved successfully'));
  } catch (error: any) {
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const updateQuestionHandler = async (req: Request<{ id: string }, {}, UpdateQuestionInput>, res: Response) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await questionService.updateQuestion(id, req.body);
    return res.status(200).json(createSuccessResponse(updatedQuestion, 'Question updated successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Question or associated learning objective not found.'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const deleteQuestionHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    await questionService.deleteQuestion(id);
    return res.status(200).json(createSuccessResponse(null, 'Question deleted successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Question not found'));
    }
    return res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};
