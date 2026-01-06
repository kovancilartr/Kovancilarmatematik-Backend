// JWT Configuration for Prisma 7.2.0
export const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'development-access-secret-key-not-for-production-use-minimum-32-chars',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'development-refresh-secret-key-not-for-production-use-minimum-32-chars',
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  issuer: 'kovancilarmatematik',
  audience: 'kovancilarmatematik-users',
  algorithm: 'HS256' as const,
};

export const authConfig = {
  maxRefreshTokensPerUser: 5,
  tokenCleanupInterval: 24 * 60 * 60 * 1000, // 24 hours
};