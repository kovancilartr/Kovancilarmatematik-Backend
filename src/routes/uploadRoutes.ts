import { Router } from 'express';
import { uploadController } from '../controllers/uploadController';
import { uploadSingle, uploadMultiple, uploadFields } from '../middleware/upload';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware'; // Import authorizeRole
import { Role } from '@prisma/client'; // Import Role enum

const router = Router();

// Tüm upload route'ları admin yetkisi gerektirir
router.use(authenticateToken, authorizeRole([Role.ADMIN])); // DEĞİŞTİRİLDİ

// Tek dosya upload
router.post('/single', uploadSingle('file'), uploadController.uploadSingle);

// Çoklu dosya upload
router.post('/multiple', uploadMultiple('files', 5), uploadController.uploadMultiple);

// Farklı alanlar için dosya upload (image, video, pdf)
router.post('/fields', uploadFields, uploadController.uploadFields);

// Dosya sil
router.delete('/:filename', uploadController.deleteFile);

export default router;