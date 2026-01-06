import { Request, Response } from 'express';
import * as materialService from '../services/material.service';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { CreateMaterialInput, UpdateMaterialInput } from '../schemas/material.schema';

export const createMaterialHandler = async (req: Request<{}, {}, CreateMaterialInput>, res: Response) => {
  try {
    const material = await materialService.createMaterial(req.body);
    res.status(201).json(createSuccessResponse(material, 'Material created successfully'));
  } catch (error: any) {
    if (error.code === 'P2002') {
        return res.status(409).json(createErrorResponse('CONFLICT', 'Material with this name already exists for this lesson'));
    }
    if (error.code === 'P2025') {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Lesson not found'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getAllMaterialsHandler = async (req: Request, res: Response) => {
  try {
    const materials = await materialService.getAllMaterials();
    res.status(200).json(createSuccessResponse(materials, 'Materials retrieved successfully'));
  } catch (error: any) {
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const getMaterialsByLessonIdHandler = async (req: Request<{ lessonId: string }>, res: Response) => {
    try {
      const materials = await materialService.getMaterialsByLessonId(req.params.lessonId);
      res.status(200).json(createSuccessResponse(materials, 'Materials retrieved successfully'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  };

export const getMaterialByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const material = await materialService.getMaterialById(req.params.id);
      if (!material) {
        return res.status(404).json(createErrorResponse('NOT_FOUND', 'Material not found'));
      }
      res.status(200).json(createSuccessResponse(material, 'Material retrieved successfully'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  };

export const updateMaterialHandler = async (req: Request<{ id: string }, {}, UpdateMaterialInput>, res: Response) => {
  try {
    const updatedMaterial = await materialService.updateMaterial(req.params.id, req.body);
    res.status(200).json(createSuccessResponse(updatedMaterial, 'Material updated successfully'));
  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json(createErrorResponse('NOT_FOUND', 'Material or Lesson not found'));
    }
    if (error.code === 'P2002') {
        return res.status(409).json(createErrorResponse('CONFLICT', 'Material with this name already exists for this lesson'));
    }
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
};

export const deleteMaterialHandler = async (req: Request<{ id: string }>, res: Response) => {
    try {
        await materialService.deleteMaterial(req.params.id);
        res.status(200).json(createSuccessResponse(null, 'Material deleted successfully'));
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json(createErrorResponse('NOT_FOUND', 'Material not found'));
        }
        res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
};

