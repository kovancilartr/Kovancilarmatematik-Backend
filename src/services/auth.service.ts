import { prisma } from '../config/database';
import { 
  generateTokenPair, 
  refreshAccessToken, 
  revokeRefreshToken, 
  revokeAllRefreshTokens
} from '../utils/jwt.utils';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest,
  TokenPayload 
} from '../types/auth.types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          name: data.name.trim(),
          password: hashedPassword,
          role: data.role,
        },
      });

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = await generateTokenPair(tokenPayload);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tokens,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Compare password
      const isPasswordValid = await comparePassword(data.password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = await generateTokenPair(tokenPayload);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tokens,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(data: RefreshTokenRequest) {
    try {
      const tokens = await refreshAccessToken(data.refreshToken);
      return { tokens };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Logout user (revoke refresh token)
   */
  static async logout(refreshToken: string): Promise<void> {
    try {
      await revokeRefreshToken(refreshToken);
      return void 0;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Logout from all devices
   */
  static async logoutAll(userId: string): Promise<void> {
    try {
      await revokeAllRefreshTokens(userId);
    } catch (error) {
      console.error('Logout all error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
}