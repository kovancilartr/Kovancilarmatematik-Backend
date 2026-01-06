import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { CreateSubjectInput, UpdateSubjectInput } from '../schemas/subject.schema';

export const createSubjectHandler = async (req: Request<{}, {}, CreateSubjectInput>, res: Response) => {
  try {
    const subject = await subjectService.createSubject(req.body);
    res.status(201).json(createSuccessResponse(subject, 'Subject created successfully'));
  } catch (error: any) {
    if (error.code === 'P2002') {
        return res.status(409).json(createErrorResponse('CONFLICT', 'Subject with this name already exists in this category'));
    }
    if (error.code === 'P2025') {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Category not found'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getAllSubjectsHandler = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.status(200).json(createSuccessResponse(subjects, 'Subjects retrieved successfully'));
  } catch (error: any) {
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getSubjectsByCategoryIdHandler = async (req: Request<{ categoryId: string }>, res: Response) => {
    try {
      const subjects = await subjectService.getSubjectsByCategoryId(req.params.categoryId);
      res.status(200).json(createSuccessResponse(subjects, 'Subjects retrieved successfully'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  };

export const getSubjectByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const subject = await subjectService.getSubjectById(req.params.id);
      if (!subject) {
        return res.status(404).json(createErrorResponse('NOT_FOUND', 'Subject not found'));
      }
      res.status(200).json(createSuccessResponse(subject, 'Subject retrieved successfully'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  };

export const updateSubjectHandler = async (req: Request<{ id: string }, {}, UpdateSubjectInput>, res: Response) => {
  try {
    const updatedSubject = await subjectService.updateSubject(req.params.id, req.body);
    res.status(200).json(createSuccessResponse(updatedSubject, 'Subject updated successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json(createErrorResponse('NOT_FOUND', 'Subject or Category not found'));
    }
    if (error.code === 'P2002') {
        return res.status(409).json(createErrorResponse('CONFLICT', 'Subject with this name already exists in this category'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const deleteSubjectHandler = async (req: Request<{ id: string }>, res: Response) => {
    try {
        await subjectService.deleteSubject(req.params.id);
        res.status(200).json(createSuccessResponse(null, 'Subject deleted successfully'));
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json(createErrorResponse('NOT_FOUND', 'Subject not found'));
        }
        res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};
