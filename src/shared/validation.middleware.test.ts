import { describe, expect, it, vi } from 'vitest';
import { z, ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { validateBody } from './validation.middleware.js';

describe('validateBody middleware', () => {
  const testSchema = z.object({
    name: z.string().min(1),
    age: z.number().positive(),
    role: z.string().default('user'),
  });

  it('llama a next() y reemplaza req.body con los datos parseados y defaults cuando la validacion es exitosa', () => {
    const middleware = validateBody(testSchema);

    const req = {
      body: {
        name: 'Carlos',
        age: 30,
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Sin argumentos indica éxito en Express
    expect(req.body).toEqual({
      name: 'Carlos',
      age: 30,
      role: 'user', // Default aplicado por Zod
    });
  });

  it('llama a next(error) con una instancia de ZodError cuando el body no cumple el schema', () => {
    const middleware = validateBody(testSchema);

    const req = {
      body: {
        name: '',
        age: -5,
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
  });

  it('llama a next(error) si req.body es undefined', () => {
    const middleware = validateBody(testSchema);

    const req = {
      body: undefined,
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
  });
});
