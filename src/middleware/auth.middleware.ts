import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import { Role } from '@prisma/client';
import { createErrorResponse } from '../utils/response.utils';
import { prisma } from '../config/database'; // Use centralized prisma instance

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

/**
 * Middleware to authenticate JWT access tokens
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const response = createErrorResponse('NO_TOKEN', 'Access token is required');
      res.status(401).json(response);
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      const response = createErrorResponse('INVALID_TOKEN', 'Invalid access token');
      res.status(401).json(response);
      return;
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      const response = createErrorResponse('USER_NOT_FOUND', 'User not found or deactivated');
      res.status(401).json(response);
      return;
    }

    // Attach user information to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    const response = createErrorResponse('AUTH_ERROR', 'Authentication failed');
    res.status(401).json(response);
  }
};

/**
 * Middleware factory to authorize requests based on user role
 * @param requiredRole The role required to access the route
 */
export const authorizeRole = (requiredRole: Role) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== requiredRole) {
            const response = createErrorResponse('FORBIDDEN', 'You do not have permission to perform this action');
            return res.status(403).json(response);
        }
        next();
    };
};