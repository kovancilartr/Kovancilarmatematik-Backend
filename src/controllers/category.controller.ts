import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';

export const createCategoryHandler = async (req: Request<{}, {}, CreateCategoryInput>, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(createSuccessResponse(category, 'Category created successfully'));
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json(createErrorResponse('CONFLICT', 'Category with this name already exists'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getAllCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // Cast to any or AuthenticatedRequest if imported
    const categories = await categoryService.getAllCategories(user);
    res.status(200).json(createSuccessResponse(categories, 'Categories retrieved successfully'));
  } catch (error: any) {
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getCategoryByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = (req as any).user;
    const category = await categoryService.getCategoryById(req.params.id, user); // Pass user
    if (!category) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Category not found'));
    }
    res.status(200).json(createSuccessResponse(category, 'Category retrieved successfully'));
  } catch (error: any) {
    if (error.message === 'ACCESS_DENIED') {
      return res.status(403).json(createErrorResponse('FORBIDDEN', 'You do not have permission to access this course.'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const updateCategoryHandler = async (req: Request<{ id: string }, {}, UpdateCategoryInput>, res: Response) => {
  try {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(createSuccessResponse(updatedCategory, 'Category updated successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Category not found'));
    }
    if (error.code === 'P2002') {
      return res.status(409).json(createErrorResponse('CONFLICT', 'Category with this name already exists'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const deleteCategoryHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json(createSuccessResponse(null, 'Category deleted successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Category not found'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

