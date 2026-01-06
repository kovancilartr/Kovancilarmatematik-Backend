import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  loginSchema, 
  registerSchema, 
  refreshTokenRequestSchema,
  logoutSchema
} from '../schemas/auth.schema';

const router = Router();

/**
 * Public authentication routes
 */

// POST /api/auth/register - Register a new user
router.post('/register', validateRequest(registerSchema), AuthController.register);

// POST /api/auth/login - Login user
router.post('/login', validateRequest(loginSchema), AuthController.login);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', validateRequest(refreshTokenRequestSchema), AuthController.refreshToken);

// POST /api/auth/logout - Logout user (revoke refresh token)
router.post('/logout', validateRequest(logoutSchema), AuthController.logout);

/**
 * Protected authentication routes (require authentication)
 */

// GET /api/auth/me - Get current user profile
router.get('/me', authenticateToken, AuthController.getProfile);

// POST /api/auth/logout-all - Logout from all devices
router.post('/logout-all', authenticateToken, AuthController.logoutAll);

export default router;