import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MERCADOPAGO_ACCESS_TOKEN: z
    .string()
    .min(1, 'MERCADOPAGO_ACCESS_TOKEN es obligatorio'),
  MERCADOPAGO_BASE_URL: z.url().default('https://api.mercadopago.com'),
});

export type Env = z.infer<typeof envSchema>;

export type EnvSource = Record<string, string | undefined>;

export class EnvValidationError extends Error {
  constructor(public readonly fieldErrors: Record<string, string[] | undefined>){
    super('Variables de entorno invalidas');
    this.name = 'EnvValidationError';
  }
}

export function loadEnv(source: EnvSource = process.env): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const flattened = z.flattenError(result.error);
    throw new EnvValidationError(flattened.fieldErrors);
  }

  return result.data;
}