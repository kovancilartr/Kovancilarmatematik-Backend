import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  loginSchema, 
  registerSchema, 
  refreshTokenRequestSchema,
  logoutSchema
} from '../schemas/auth.schema';
import { Role } from '@prisma/client';

const router = Router();


// POST /api/auth/login - Login user
router.post('/login', validateRequest(loginSchema), AuthController.login);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', validateRequest(refreshTokenRequestSchema), AuthController.refreshToken);

// POST /api/auth/logout - Logout user (revoke refresh token)
router.post('/logout', validateRequest(logoutSchema), AuthController.logout);

/**
 * Protected authentication routes (require authentication)
 */

// POST /api/auth/register - Create a new user (Admin only)
router.post(
  '/register',
  authenticateToken,
  authorizeRole([Role.ADMIN]),
  validateRequest(registerSchema),
  AuthController.register
);

// GET /api/auth/me - Get current user profile
router.get('/me', authenticateToken, AuthController.getProfile);

// POST /api/auth/logout-all - Logout from all devices
router.post('/logout-all', authenticateToken, AuthController.logoutAll);

export default router;