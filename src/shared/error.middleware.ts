import type { Request, Response, NextFunction } from 'express';
import { 
  MercadoPagoHttpError, 
  MercadoPagoInvalidResponseError, 
  MercadoPagoConnectionError 
} from "../payments/mercadopago.errors.js";
import { ZodError } from 'zod';

export const globalErrorHandler = (
  err: unknown, 
  req: Request, 
  res: Response, 
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      error: 'Validation Error',
      issues: err.issues,
    });
    return;
  }

  if (err instanceof MercadoPagoHttpError) {
    res.status(502).json({
      status: 502,
      message: err.message,
      body: err.body,
    });
    return;
  }

  if (err instanceof MercadoPagoInvalidResponseError) {
    res.status(502).json({
      status: 502,
      message: err.message,
    });
    return;
  }

  if (err instanceof MercadoPagoConnectionError) {
    res.status(503).json({
      status: 503,
      message: err.message,
    });
    return;
  }

  // Fallback para cualquier error no contemplado
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
  });
};

