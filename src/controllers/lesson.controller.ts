import { Request, Response } from 'express';
import * as lessonService from '../services/lesson.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { CreateLessonInput, UpdateLessonInput } from '../schemas/lesson.schema';

export const createLessonHandler = async (req: Request<{}, {}, CreateLessonInput>, res: Response) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    res.status(201).json(createSuccessResponse(lesson, 'Lesson created successfully'));
  } catch (error: any) {
    if (error.code === 'P2002') {
        return res.status(409).json(createErrorResponse('CONFLICT', 'Lesson with this name already exists in this subject'));
    }
    if (error.code === 'P2025') {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Subject not found'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getAllLessonsHandler = async (req: Request, res: Response) => {
  try {
    const lessons = await lessonService.getAllLessons();
    res.status(200).json(createSuccessResponse(lessons, 'Lessons retrieved successfully'));
  } catch (error: any) {
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getLessonsBySubjectIdHandler = async (req: Request<{ subjectId: string }>, res: Response) => {
    try {
      const lessons = await lessonService.getLessonsBySubjectId(req.params.subjectId);
      res.status(200).json(createSuccessResponse(lessons, 'Lessons retrieved successfully'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  };

export const getLessonByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const lesson = await lessonService.getLessonById(req.params.id);
      if (!lesson) {
        return res.status(404).json(createErrorResponse('NOT_FOUND', 'Lesson not found'));
      }
      res.status(200).json(createSuccessResponse(lesson, 'Lesson retrieved successfully'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  };

export const updateLessonHandler = async (req: Request<{ id: string }, {}, UpdateLessonInput>, res: Response) => {
  try {
    const updatedLesson = await lessonService.updateLesson(req.params.id, req.body);
    res.status(200).json(createSuccessResponse(updatedLesson, 'Lesson updated successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json(createErrorResponse('NOT_FOUND', 'Lesson or Subject not found'));
    }
    if (error.code === 'P2002') {
        return res.status(409).json(createErrorResponse('CONFLICT', 'Lesson with this name already exists in this subject'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const deleteLessonHandler = async (req: Request<{ id: string }>, res: Response) => {
    try {
        await lessonService.deleteLesson(req.params.id);
        res.status(200).json(createSuccessResponse(null, 'Lesson deleted successfully'));
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json(createErrorResponse('NOT_FOUND', 'Lesson not found'));
        }
        res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};
