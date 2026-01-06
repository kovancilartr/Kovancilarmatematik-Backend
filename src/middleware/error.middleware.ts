import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '../utils/response.utils';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Global error handler:', error);

  // Default error response
  const response = createErrorResponse(
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred'
  );

  res.status(500).json(response);
};