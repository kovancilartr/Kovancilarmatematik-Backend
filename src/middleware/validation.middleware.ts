import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createErrorResponse } from '../utils/response.utils';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        const response = createErrorResponse('VALIDATION_ERROR', errorMessage);
        res.status(400).json(response);
        return;
      }
      
      const response = createErrorResponse('VALIDATION_ERROR', 'Invalid request data');
      res.status(400).json(response);
    }
  };
};