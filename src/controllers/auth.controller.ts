import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginRequest, RegisterRequest, RefreshTokenRequest } from '../types/auth.types';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createSuccessResponse, createErrorResponse } from '../utils/response.utils';

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const registerData: RegisterRequest = req.body;
      
      const result = await AuthService.register(registerData);
      
      const responseData = {
        user: {
          ...result.user,
          createdAt: result.user.createdAt.toISOString(),
          updatedAt: result.user.updatedAt.toISOString()
        },
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken
      };
      
      const response = createSuccessResponse(
        responseData, 
        'Account created successfully!'
      );
      res.status(201).json(response);
    } catch (error: any) {
      console.error('Register controller error:', error);
      const response = createErrorResponse('REGISTER_ERROR', error.message || 'Registration failed');
      res.status(400).json(response);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
      
      const result = await AuthService.login(loginData);
      
      const responseData = {
        user: {
          ...result.user,
          createdAt: result.user.createdAt.toISOString(),
          updatedAt: result.user.updatedAt.toISOString()
        },
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken
      };
      
      const response = createSuccessResponse(responseData, 'Login successful');
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Login controller error:', error);
      const response = createErrorResponse('LOGIN_ERROR', error.message || 'Login failed');
      res.status(401).json(response);
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshData: RefreshTokenRequest = req.body;
      
      const result = await AuthService.refreshToken(refreshData);
      
      const response = createSuccessResponse(result, 'Token refreshed successfully');
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Refresh token controller error:', error);
      const response = createErrorResponse('REFRESH_ERROR', error.message || 'Token refresh failed');
      res.status(401).json(response);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      await AuthService.logout(refreshToken);
      
      const response = createSuccessResponse(null, 'Logout successful');
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Logout controller error:', error);
      const response = createErrorResponse('LOGOUT_ERROR', error.message || 'Logout failed');
      res.status(400).json(response);
    }
  }

  /**
   * Logout from all devices
   * POST /api/auth/logout-all
   */
  static async logoutAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response = createErrorResponse('UNAUTHORIZED', 'User not authenticated');
        res.status(401).json(response);
        return;
      }

      await AuthService.logoutAll(req.user.id);
      
      const response = createSuccessResponse(null, 'Logged out from all devices');
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Logout all controller error:', error);
      const response = createErrorResponse('LOGOUT_ALL_ERROR', error.message || 'Logout all failed');
      res.status(400).json(response);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response = createErrorResponse('UNAUTHORIZED', 'User not authenticated');
        res.status(401).json(response);
        return;
      }

      const user = await AuthService.getProfile(req.user.id);
      
      const responseData = {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
      
      const response = createSuccessResponse(responseData, 'Profile retrieved successfully');
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Get profile controller error:', error);
      const response = createErrorResponse('PROFILE_ERROR', error.message || 'Failed to get profile');
      res.status(400).json(response);
    }
  }
}