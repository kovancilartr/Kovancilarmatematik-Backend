import jwt from 'jsonwebtoken';
import { jwtConfig, authConfig } from '../config/jwt';
import { prisma } from '../config/database';
import { TokenPayload, TokenPair } from '../types/auth.types';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiry,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithm: jwtConfig.algorithm,
  } as jwt.SignOptions);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiry,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithm: jwtConfig.algorithm,
  } as jwt.SignOptions);
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, jwtConfig.accessTokenSecret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    } as jwt.VerifyOptions) as TokenPayload;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, jwtConfig.refreshTokenSecret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    } as jwt.VerifyOptions) as TokenPayload;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

/**
 * Store refresh token in database
 */
const storeRefreshToken = async (token: string, userId: string): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  // Clean up old tokens if user has too many
  const tokenCount = await prisma.refreshToken.count({
    where: { userId },
  });

  if (tokenCount > authConfig.maxRefreshTokensPerUser) {
    const oldestTokens = await prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: tokenCount - authConfig.maxRefreshTokensPerUser,
    });

    await prisma.refreshToken.deleteMany({
      where: {
        id: { in: oldestTokens.map(t => t.id) },
      },
    });
  }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = async (payload: TokenPayload): Promise<TokenPair> => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await storeRefreshToken(refreshToken, payload.userId);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new Error('Invalid refresh token');
  }

  // Check if token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Refresh token expired or not found');
  }

  // Generate new token pair
  const payload: TokenPayload = {
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
  };

  const newTokens = await generateTokenPair(payload);

  // Revoke old refresh token
  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });

  return newTokens;
};

/**
 * Revoke refresh token
 */
export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });

  return Promise.resolve();
};

/**
 * Revoke all refresh tokens for a user
 */
export const revokeAllRefreshTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

/**
 * Clean up expired tokens
 */
export const cleanupExpiredTokens = async (): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
};