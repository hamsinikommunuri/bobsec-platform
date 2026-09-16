import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
          }
        });
        return;
      }
      next(error);
    }
  };
}
