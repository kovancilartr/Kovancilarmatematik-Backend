import { Request, Response } from 'express';
import { siteSettingsService } from '../services/siteSettingsService';
import { UpdateSiteSettingsSchema } from '../schemas/siteSettingsSchemas';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';
import { ZodError } from 'zod';

export const siteSettingsController = {
  // Site ayarlarını getir
  async getSiteSettings(req: Request, res: Response) {
    try {
      const settings = await siteSettingsService.getSiteSettings();
      res.status(200).json(createSuccessResponse(settings, 'Site settings retrieved successfully'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  },

  // Site ayarlarını güncelle
  async updateSiteSettings(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = UpdateSiteSettingsSchema.parse(req.body);
      
      const settings = await siteSettingsService.updateSiteSettings(validatedData);

      res.status(200).json(createSuccessResponse(settings, 'Site settings updated successfully'));
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map(e => e.message).join(', ');
        return res.status(400).json(createErrorResponse('VALIDATION_ERROR', errorMessage));
      }
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  },

  // Site ayarlarını sıfırla (varsayılan değerlere döndür)
  async resetSiteSettings(req: AuthenticatedRequest, res: Response) {
    try {
      const settings = await siteSettingsService.resetSiteSettings();
      res.status(200).json(createSuccessResponse(settings, 'Site settings reset to default'));
    } catch (error: any) {
      res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
    }
  }
};