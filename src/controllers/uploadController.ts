import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import path from 'path';
import fs from 'fs';
import { UTApi } from 'uploadthing/server';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';

// Initialize UTApi if secrets are present
const utapi = new UTApi();

export const uploadController = {
  // Tek dosya upload
  async uploadSingle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Dosya yüklenmedi'));
      }

      // Check if UploadThing takes over
      if (process.env.UPLOADTHING_TOKEN) {
        try {
          // Read file from disk
          const fileBuffer = fs.readFileSync(req.file.path);
          const fileToUpload = new File([fileBuffer], req.file.originalname, { type: req.file.mimetype });

          const response = await utapi.uploadFiles(fileToUpload);

          if (response.error) {
            throw new Error(response.error.message);
          }

          // Delete local file after successful upload
          fs.unlinkSync(req.file.path);

          res.status(200).json(createSuccessResponse({
            filename: response.data.key,
            originalName: response.data.name,
            mimetype: req.file.mimetype,
            size: response.data.size,
            url: response.data.url,
            // key: response.data.key
          }, 'Dosya başarıyla UploadThing\'e yüklendi'));
          return;

        } catch (utError: any) {
          console.error("UploadThing Error:", utError);
          // Fallback to local? Or return error?
          // For now, let's treat it as a failure to upload to avoid partial state confusion, or we can just proceed with local.
          // Considering the user ASKED for this, we should probably fail if it fails.
          return res.status(500).json(createErrorResponse('SERVER_ERROR', `UploadThing error: ${utError.message}`));
        }
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

      if (process.env.UPLOADTHING_SECRET && process.env.UPLOADTHING_APP_ID) {
        try {
          const filesToUpload = files.map(file => {
            const fileBuffer = fs.readFileSync(file.path);
            return new File([fileBuffer], file.originalname, { type: file.mimetype });
          });

          const responses = await utapi.uploadFiles(filesToUpload);
          // utapi.uploadFiles returns an array of responses if multiple files are passed

          const uploadedFiles = [];
          for (let i = 0; i < responses.length; i++) {
            const resp = responses[i];
            if (resp.error) {
              throw new Error(resp.error.message);
            }
            const originalFile = files[i];

            // Delete local file
            fs.unlinkSync(originalFile.path);

            uploadedFiles.push({
              filename: resp.data.key,
              originalName: resp.data.name,
              mimetype: originalFile.mimetype,
              size: resp.data.size,
              url: resp.data.url,
            });
          }

          res.status(200).json(createSuccessResponse(uploadedFiles, `${files.length} dosya başarıyla UploadThing'e yüklendi`));
          return;

        } catch (utError: any) {
          return res.status(500).json(createErrorResponse('SERVER_ERROR', `UploadThing error: ${utError.message}`));
        }
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

      if (process.env.UPLOADTHING_SECRET && process.env.UPLOADTHING_APP_ID) {
        try {
          const uploadedFiles: any = {};

          const allFiles: Express.Multer.File[] = [];
          // Flatten files to process
          Object.keys(files).forEach(fieldName => {
            allFiles.push(...files[fieldName]);
          });

          // Upload all at once? Or by field? 
          // utapi accepts array. mapping back results to fields might be tricky if order isn't preserved or we mix fields.
          // Safest is to upload field by field or just track indices.

          // Let's do a linear pass accumulating files to upload and keeping track of their field/index
          const uploadTasks = [];
          const metaData = [];

          for (const fieldName of Object.keys(files)) {
            for (const file of files[fieldName]) {
              const fileBuffer = fs.readFileSync(file.path);
              uploadTasks.push(new File([fileBuffer], file.originalname, { type: file.mimetype }));
              metaData.push({ fieldName, file });
            }
          }

          const responses = await utapi.uploadFiles(uploadTasks);

          for (let i = 0; i < responses.length; i++) {
            const resp = responses[i];
            const { fieldName, file } = metaData[i];

            if (resp.error) {
              throw new Error(resp.error.message);
            }

            // Delete local
            fs.unlinkSync(file.path);

            if (!uploadedFiles[fieldName]) {
              uploadedFiles[fieldName] = [];
            }

            uploadedFiles[fieldName].push({
              filename: resp.data.key,
              originalName: resp.data.name,
              mimetype: file.mimetype,
              size: resp.data.size,
              url: resp.data.url,
            });
          }

          res.status(200).json(createSuccessResponse(uploadedFiles, 'Dosyalar başarıyla UploadThing\'e yüklendi'));
          return;

        } catch (utError: any) {
          return res.status(500).json(createErrorResponse('SERVER_ERROR', `UploadThing error: ${utError.message}`));
        }
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