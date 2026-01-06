import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import path from 'path';
import fs from 'fs';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';

export const uploadController = {
  // Tek dosya upload
  async uploadSingle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Dosya yüklenmedi'));
      }

      const fileUrl = `/uploads/${path.basename(req.file.path)}`;

      res.status(200).json(createSuccessResponse({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path
      }, 'Dosya başarıyla yüklendi'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  },

  // Çoklu dosya upload
  async uploadMultiple(req: AuthenticatedRequest, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Dosya yüklenmedi'));
      }

      const uploadedFiles = files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${path.basename(file.path)}`,
        path: file.path
      }));

      res.status(200).json(createSuccessResponse(uploadedFiles, `${files.length} dosya başarıyla yüklendi`));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  },

  // Farklı alanlar için dosya upload
  async uploadFields(req: AuthenticatedRequest, res: Response) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files || Object.keys(files).length === 0) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Dosya yüklenmedi'));
      }

      const uploadedFiles: any = {};

      Object.keys(files).forEach(fieldName => {
        uploadedFiles[fieldName] = files[fieldName].map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: `/uploads/${path.basename(file.path)}`,
          path: file.path
        }));
      });

      res.status(200).json(createSuccessResponse(uploadedFiles, 'Dosyalar başarıyla yüklendi'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  },

  // Dosya sil
  async deleteFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Dosya adı gereklidir'));
      }

      const filePath = path.join(process.cwd(), 'uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json(createErrorResponse('NOT_FOUND', 'Dosya bulunamadı'));
      }

      fs.unlinkSync(filePath);

      res.status(200).json(createSuccessResponse(null, 'Dosya başarıyla silindi'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  }
};