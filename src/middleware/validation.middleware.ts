import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createErrorResponse } from '../utils/response.utils';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the entire request object (body, params, query) against the schema
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Create a more descriptive error message
        const errorMessage = error.errors.map(err => `${err.path.join('.')} - ${err.message}`).join('; ');
        const response = createErrorResponse('VALIDATION_ERROR', errorMessage);
        res.status(400).json(response);
        return;
      }
      
      // Handle non-Zod errors
      const response = createErrorResponse('SERVER_ERROR', 'An unexpected error occurred during validation.');
      res.status(500).json(response);
    }
  };
};