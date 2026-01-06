import { Router } from 'express';
import { siteSettingsController } from '../controllers/siteSettingsController';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client'; // Import Role enum
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils'; // Import createSuccessResponse and createErrorResponse
import { validateRequest } from '../middleware/validation.middleware'; // Import validateRequest
import { UpdateSiteSettingsSchema } from '../schemas/siteSettingsSchemas'; // Import schema

const router = Router();

// Public route - herkes site ayarlarını görebilir (sadece public olanlar)
router.get('/public', async (req, res) => {
  try {
    const { siteSettingsService } = await import('../services/siteSettingsService');
    const settings = await siteSettingsService.getPublicSettings();
    res.status(200).json(createSuccessResponse(settings, 'Public site settings retrieved successfully'));
  } catch (error: any) {
    res.status(500).json(createErrorResponse('SERVER_ERROR', error.message));
  }
});

// Protected routes (Admin only for modification/reset)
router.get('/', authenticateToken, authorizeRole(Role.ADMIN), siteSettingsController.getSiteSettings);
router.put('/', authenticateToken, authorizeRole(Role.ADMIN), validateRequest(UpdateSiteSettingsSchema), siteSettingsController.updateSiteSettings);
router.post('/reset', authenticateToken, authorizeRole(Role.ADMIN), siteSettingsController.resetSiteSettings);

export default router;